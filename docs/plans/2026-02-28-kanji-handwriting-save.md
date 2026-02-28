# 漢字手書き保存機能 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 9マスのなぞり書き練習から1つを選んで保存し、漢字表に表示する機能を実装する

**Architecture:** バックエンドに新規テーブル`saved_handwriting`を追加し、RESTful APIを実装。フロントエンドは既存の`WritingGrid`コンポーネントに保存ボタンを追加し、`KanjiChart`コンポーネントで保存済み手書きを表示する。

**Tech Stack:** Spring Boot 2.7.18, React 18, H2 Database, JWT認証

---

## Task 1: バックエンド - エンティティとリポジトリ作成

**Files:**
- Create: `backend/src/main/java/com/hiragana/model/SavedHandwriting.java`
- Create: `backend/src/main/java/com/hiragana/repository/SavedHandwritingRepository.java`

**Step 1: SavedHandwritingエンティティを作成**

`backend/src/main/java/com/hiragana/model/SavedHandwriting.java`:

```java
package com.hiragana.model;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "saved_handwriting",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "character_id"}))
public class SavedHandwriting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @Column(nullable = false)
    private Integer position;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String strokes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

**Step 2: SavedHandwritingRepositoryを作成**

`backend/src/main/java/com/hiragana/repository/SavedHandwritingRepository.java`:

```java
package com.hiragana.repository;

import com.hiragana.model.SavedHandwriting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedHandwritingRepository extends JpaRepository<SavedHandwriting, Long> {
    Optional<SavedHandwriting> findByUserIdAndCharacterId(Long userId, Long characterId);

    List<SavedHandwriting> findByUserId(Long userId);

    @Query("SELECT sh FROM SavedHandwriting sh " +
           "JOIN sh.character c " +
           "WHERE sh.user.id = :userId " +
           "AND c.grade = :grade")
    List<SavedHandwriting> findByUserIdAndGrade(
        @Param("userId") Long userId,
        @Param("grade") Integer grade
    );
}
```

**Step 3: コミット**

```bash
git add backend/src/main/java/com/hiragana/model/SavedHandwriting.java
git add backend/src/main/java/com/hiragana/repository/SavedHandwritingRepository.java
git commit -m "エンティティとリポジトリを追加

SavedHandwritingエンティティとリポジトリを作成。
ユーザーごとに1漢字1つの手書きデータを保存可能。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: バックエンド - DTOとサービス層

**Files:**
- Create: `backend/src/main/java/com/hiragana/dto/SaveHandwritingRequest.java`
- Create: `backend/src/main/java/com/hiragana/dto/SavedHandwritingResponse.java`
- Create: `backend/src/main/java/com/hiragana/service/HandwritingService.java`

**Step 1: SaveHandwritingRequest DTOを作成**

`backend/src/main/java/com/hiragana/dto/SaveHandwritingRequest.java`:

```java
package com.hiragana.dto;

import lombok.Data;

@Data
public class SaveHandwritingRequest {
    private Long userId;
    private Long characterId;
    private Integer position;
    private String strokes;
}
```

**Step 2: SavedHandwritingResponse DTOを作成**

`backend/src/main/java/com/hiragana/dto/SavedHandwritingResponse.java`:

```java
package com.hiragana.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SavedHandwritingResponse {
    private Long id;
    private Long characterId;
    private String character;
    private Integer grade;
    private Integer position;
    private String strokes;
    private LocalDateTime createdAt;
}
```

**Step 3: HandwritingServiceを作成**

`backend/src/main/java/com/hiragana/service/HandwritingService.java`:

```java
package com.hiragana.service;

import com.hiragana.dto.SaveHandwritingRequest;
import com.hiragana.dto.SavedHandwritingResponse;
import com.hiragana.model.Character;
import com.hiragana.model.SavedHandwriting;
import com.hiragana.model.User;
import com.hiragana.repository.CharacterRepository;
import com.hiragana.repository.SavedHandwritingRepository;
import com.hiragana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HandwritingService {

    @Autowired
    private SavedHandwritingRepository savedHandwritingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CharacterRepository characterRepository;

    @Transactional
    public SavedHandwriting saveHandwriting(SaveHandwritingRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

        Character character = characterRepository.findById(request.getCharacterId())
            .orElseThrow(() -> new RuntimeException("文字が見つかりません"));

        SavedHandwriting handwriting = new SavedHandwriting();
        handwriting.setUser(user);
        handwriting.setCharacter(character);
        handwriting.setPosition(request.getPosition());
        handwriting.setStrokes(request.getStrokes());

        return savedHandwritingRepository.save(handwriting);
    }

    @Transactional
    public SavedHandwriting updateHandwriting(Long id, SaveHandwritingRequest request) {
        SavedHandwriting handwriting = savedHandwritingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("保存データが見つかりません"));

        handwriting.setPosition(request.getPosition());
        handwriting.setStrokes(request.getStrokes());

        return savedHandwritingRepository.save(handwriting);
    }

    public Optional<SavedHandwriting> checkExists(Long userId, Long characterId) {
        return savedHandwritingRepository.findByUserIdAndCharacterId(userId, characterId);
    }

    public List<SavedHandwritingResponse> getUserHandwritings(Long userId, Integer grade) {
        List<SavedHandwriting> handwritings;

        if (grade != null) {
            handwritings = savedHandwritingRepository.findByUserIdAndGrade(userId, grade);
        } else {
            handwritings = savedHandwritingRepository.findByUserId(userId);
        }

        return handwritings.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteHandwriting(Long id) {
        savedHandwritingRepository.deleteById(id);
    }

    private SavedHandwritingResponse convertToResponse(SavedHandwriting handwriting) {
        SavedHandwritingResponse response = new SavedHandwritingResponse();
        response.setId(handwriting.getId());
        response.setCharacterId(handwriting.getCharacter().getId());
        response.setCharacter(handwriting.getCharacter().getCharacter());
        response.setGrade(handwriting.getCharacter().getGrade());
        response.setPosition(handwriting.getPosition());
        response.setStrokes(handwriting.getStrokes());
        response.setCreatedAt(handwriting.getCreatedAt());
        return response;
    }
}
```

**Step 4: コミット**

```bash
git add backend/src/main/java/com/hiragana/dto/SaveHandwritingRequest.java
git add backend/src/main/java/com/hiragana/dto/SavedHandwritingResponse.java
git add backend/src/main/java/com/hiragana/service/HandwritingService.java
git commit -m "DTOとサービス層を追加

手書き保存のリクエスト/レスポンスDTOとビジネスロジックを実装。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: バックエンド - コントローラー

**Files:**
- Create: `backend/src/main/java/com/hiragana/controller/HandwritingController.java`
- Modify: `backend/src/main/java/com/hiragana/config/SecurityConfig.java`

**Step 1: HandwritingControllerを作成**

`backend/src/main/java/com/hiragana/controller/HandwritingController.java`:

```java
package com.hiragana.controller;

import com.hiragana.dto.SaveHandwritingRequest;
import com.hiragana.dto.SavedHandwritingResponse;
import com.hiragana.model.SavedHandwriting;
import com.hiragana.service.HandwritingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/handwriting")
public class HandwritingController {
    private static final Logger logger = LoggerFactory.getLogger(HandwritingController.class);

    @Autowired
    private HandwritingService handwritingService;

    @PostMapping
    public ResponseEntity<?> saveHandwriting(@RequestBody SaveHandwritingRequest request) {
        try {
            logger.info("保存リクエスト: userId={}, characterId={}",
                request.getUserId(), request.getCharacterId());

            SavedHandwriting saved = handwritingService.saveHandwriting(request);

            Map<String, Object> response = new HashMap<>();
            response.put("id", saved.getId());
            response.put("message", "保存しました");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("保存エラー", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkExists(
            @RequestParam Long userId,
            @RequestParam Long characterId) {
        Optional<SavedHandwriting> existing = handwritingService.checkExists(userId, characterId);

        Map<String, Object> response = new HashMap<>();
        response.put("exists", existing.isPresent());
        if (existing.isPresent()) {
            response.put("handwritingId", existing.get().getId());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedHandwritingResponse>> getUserHandwritings(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer grade) {
        logger.info("取得リクエスト: userId={}, grade={}", userId, grade);

        List<SavedHandwritingResponse> handwritings =
            handwritingService.getUserHandwritings(userId, grade);

        return ResponseEntity.ok(handwritings);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHandwriting(
            @PathVariable Long id,
            @RequestBody SaveHandwritingRequest request) {
        try {
            logger.info("更新リクエスト: id={}", id);

            SavedHandwriting updated = handwritingService.updateHandwriting(id, request);

            Map<String, Object> response = new HashMap<>();
            response.put("id", updated.getId());
            response.put("message", "更新しました");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("更新エラー", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHandwriting(@PathVariable Long id) {
        try {
            logger.info("削除リクエスト: id={}", id);
            handwritingService.deleteHandwriting(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("削除エラー", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
```

**Step 2: SecurityConfigを更新（/api/handwritingを認証必須に）**

`backend/src/main/java/com/hiragana/config/SecurityConfig.java`の`filterChain`メソッド内:

既存の`.antMatchers`の後に以下を追加:
```java
.antMatchers("/api/handwriting/**").authenticated()
```

具体的には:
```java
.authorizeRequests()
    .antMatchers("/api/auth/**").permitAll()
    .antMatchers("/api/users").permitAll()
    .antMatchers("/api/characters/**").permitAll()
    .antMatchers("/h2-console/**").permitAll()
    .anyRequest().authenticated()
```

これはすでに`.anyRequest().authenticated()`があるため、変更不要です。

**Step 3: コミット**

```bash
git add backend/src/main/java/com/hiragana/controller/HandwritingController.java
git commit -m "コントローラーを追加

手書き保存のREST APIエンドポイントを実装。
- POST /api/handwriting (保存)
- GET /api/handwriting/check (既存確認)
- GET /api/handwriting/user/{userId} (取得)
- PUT /api/handwriting/{id} (更新)
- DELETE /api/handwriting/{id} (削除)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: フロントエンド - API通信サービス

**Files:**
- Create: `frontend/src/api/handwritingService.js`

**Step 1: handwritingServiceを作成**

`frontend/src/api/handwritingService.js`:

```javascript
import apiClient from './client';

// 手書き保存
export const saveHandwriting = async (userId, characterId, position, strokes) => {
  try {
    const response = await apiClient.post('/api/handwriting', {
      userId,
      characterId,
      position,
      strokes
    });
    return response.data;
  } catch (error) {
    console.error('手書き保存エラー:', error);
    throw error;
  }
};

// 既存データチェック
export const checkHandwritingExists = async (userId, characterId) => {
  try {
    const response = await apiClient.get('/api/handwriting/check', {
      params: { userId, characterId }
    });
    return response.data;
  } catch (error) {
    console.error('既存チェックエラー:', error);
    throw error;
  }
};

// ユーザーの保存データ取得
export const getUserHandwritings = async (userId, grade = null) => {
  try {
    const params = { };
    if (grade !== null) {
      params.grade = grade;
    }

    const response = await apiClient.get(`/api/handwriting/user/${userId}`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('手書き取得エラー:', error);
    throw error;
  }
};

// 手書き更新
export const updateHandwriting = async (id, userId, characterId, position, strokes) => {
  try {
    const response = await apiClient.put(`/api/handwriting/${id}`, {
      userId,
      characterId,
      position,
      strokes
    });
    return response.data;
  } catch (error) {
    console.error('手書き更新エラー:', error);
    throw error;
  }
};

// 手書き削除
export const deleteHandwriting = async (id) => {
  try {
    const response = await apiClient.delete(`/api/handwriting/${id}`);
    return response.data;
  } catch (error) {
    console.error('手書き削除エラー:', error);
    throw error;
  }
};
```

**Step 2: コミット**

```bash
git add frontend/src/api/handwritingService.js
git commit -m "手書きAPI通信サービスを追加

バックエンドAPIとの通信を行うサービス層を実装。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: フロントエンド - WritingGridに保存ボタン追加

**Files:**
- Modify: `frontend/src/components/WritingGrid/WritingGrid.jsx`
- Modify: `frontend/src/components/WritingGrid/WritingGrid.css`

**Step 1: WritingGrid.jsxに保存機能を追加**

`frontend/src/components/WritingGrid/WritingGrid.jsx`に以下を追加:

1. インポート追加（先頭に）:
```javascript
import { saveHandwriting, checkHandwritingExists, updateHandwriting } from '../../api/handwritingService';
```

2. state追加（既存のstateの後に）:
```javascript
const [savedPosition, setSavedPosition] = useState(null);
const [savingPosition, setSavingPosition] = useState(null);
```

3. 保存済み位置の取得（useEffect内、fetchStrokeResultsの後に）:
```javascript
useEffect(() => {
  const fetchSavedPosition = async () => {
    if (type !== 'KANJI' || !isAuthenticated || !user || !characterId) return;

    try {
      const result = await checkHandwritingExists(user.id, characterId);
      if (result.exists) {
        // 保存されているpositionを取得する必要がある
        // APIレスポンスに position を含めるか、getUserHandwritings を使用
        setSavedPosition(result.position || null);
      }
    } catch (error) {
      console.error('保存状態の確認エラー:', error);
    }
  };

  fetchSavedPosition();
}, [characterId, isAuthenticated, user, type]);
```

4. 保存ハンドラー追加（handleWritingCompleteの後に）:
```javascript
const handleSave = async (index) => {
  if (!isAuthenticated || !user || !characterId) {
    alert('ログインしてください');
    return;
  }

  const item = gridItems[index];
  if (!item.strokes || item.strokes.length === 0) {
    alert('保存する手書きデータがありません');
    return;
  }

  setSavingPosition(index);

  try {
    // 既存データチェック
    const existingCheck = await checkHandwritingExists(user.id, characterId);

    if (existingCheck.exists) {
      // 確認ダイアログ
      const confirmed = window.confirm(
        'この漢字は既に保存されています。上書きしますか？'
      );

      if (!confirmed) {
        setSavingPosition(null);
        return;
      }

      // 上書き
      await updateHandwriting(
        existingCheck.handwritingId,
        user.id,
        characterId,
        index,
        JSON.stringify(item.strokes)
      );
    } else {
      // 新規保存
      await saveHandwriting(
        user.id,
        characterId,
        index,
        JSON.stringify(item.strokes)
      );
    }

    setSavedPosition(index);
    alert('保存しました！');
  } catch (error) {
    console.error('保存エラー:', error);
    alert('保存に失敗しました。もう一度お試しください。');
  } finally {
    setSavingPosition(null);
  }
};
```

5. renderGridItem関数を更新（保存ボタンを追加）:

既存の以下の部分:
```javascript
{item.strokes.length > 0 ? (
  <>
    <div className="preview-canvas-wrapper">
      ...
    </div>
    {item.score > 0 && (
      ...
    )}
  </>
```

これを以下に変更:
```javascript
{item.strokes.length > 0 ? (
  <>
    <div className="preview-canvas-wrapper">
      ...
    </div>
    {item.score > 0 && (
      ...
    )}
    {type === 'KANJI' && (
      <button
        className={`save-button ${savedPosition === index ? 'saved' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          handleSave(index);
        }}
        disabled={savingPosition === index || savedPosition === index}
      >
        {savingPosition === index ? '保存中...' :
         savedPosition === index ? '保存済み ✓' : '📌 保存する'}
      </button>
    )}
  </>
```

**Step 2: WritingGrid.cssにスタイル追加**

`frontend/src/components/WritingGrid/WritingGrid.css`の最後に追加:

```css
.save-button {
  margin-top: 8px;
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid #3b82f6;
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover:not(:disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
}

.save-button:disabled {
  background-color: #9ca3af;
  border-color: #9ca3af;
  cursor: not-allowed;
}

.save-button.saved {
  background-color: #10b981;
  border-color: #10b981;
}

.save-button.saved:hover {
  background-color: #059669;
  border-color: #059669;
}
```

**Step 3: コミット**

```bash
git add frontend/src/components/WritingGrid/WritingGrid.jsx
git add frontend/src/components/WritingGrid/WritingGrid.css
git commit -m "WritingGridに保存ボタンを追加

9マスそれぞれに保存ボタンを配置。
既存データがある場合は上書き確認を表示。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: フロントエンド - KanjiChartに手書き表示追加

**Files:**
- Modify: `frontend/src/components/KanjiChart/KanjiChart.jsx`
- Modify: `frontend/src/components/KanjiChart/KanjiChart.css`

**Step 1: KanjiChart.jsxに手書き表示機能を追加**

`frontend/src/components/KanjiChart/KanjiChart.jsx`に以下を追加:

1. インポート追加:
```javascript
import { getUserHandwritings } from '../../api/handwritingService';
```

2. state追加:
```javascript
const [handwritingData, setHandwritingData] = useState({});
```

3. 手書きデータ取得（useEffect追加、progressDataの取得useEffectの後に）:
```javascript
useEffect(() => {
  const fetchHandwritingData = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const handwritings = await getUserHandwritings(user.id, initialGrade);

      const handwritingMap = {};
      handwritings.forEach(hw => {
        handwritingMap[hw.character] = {
          strokes: JSON.parse(hw.strokes),
          position: hw.position
        };
      });

      setHandwritingData(handwritingMap);
    } catch (error) {
      console.error('手書きデータ取得エラー:', error);
    }
  };

  fetchHandwritingData();
}, [isAuthenticated, user, initialGrade]);
```

4. handleCloseWritingGrid内で手書きデータを再取得（既存の進捗再取得の後に）:
```javascript
// 手書きデータも再取得
const fetchHandwritings = async () => {
  try {
    const handwritings = await getUserHandwritings(user.id, initialGrade);
    const handwritingMap = {};
    handwritings.forEach(hw => {
      handwritingMap[hw.character] = {
        strokes: JSON.parse(hw.strokes),
        position: hw.position
      };
    });
    setHandwritingData(handwritingMap);
  } catch (error) {
    console.error('手書きデータ更新エラー:', error);
  }
};
fetchHandwritings();
```

5. 手書き描画関数を追加:
```javascript
const drawHandwriting = (canvas, strokes, size) => {
  if (!canvas || !strokes || strokes.length === 0) return;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // 背景
  ctx.fillStyle = '#f9fafb';
  ctx.fillRect(0, 0, size, size);

  // 枠線
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, size, size);

  // スケール計算（元のキャンバスサイズは300と想定）
  const scale = size / 300;

  // ストローク描画
  strokes.forEach(stroke => {
    if (stroke.points && stroke.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x * scale, stroke.points[0].y * scale);
      stroke.points.forEach(point => {
        ctx.lineTo(point.x * scale, point.y * scale);
      });
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 3 * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  });
};
```

6. テーブルセル内の描画部分を更新:

既存の:
```javascript
<div className="kanji-bento-box">
  <ProgressStack count={progress ? progress.goodCount : 0} icon="⭐" />
</div>
```

これを以下に置き換え:
```javascript
<div className="kanji-bento-box">
  {handwritingData[item.char] ? (
    <canvas
      className="saved-handwriting-preview"
      width={50}
      height={50}
      ref={canvas => {
        if (canvas && handwritingData[item.char]) {
          drawHandwriting(canvas, handwritingData[item.char].strokes, 50);
        }
      }}
    />
  ) : null}
</div>
```

**Step 2: KanjiChart.cssにスタイル追加**

`frontend/src/components/KanjiChart/KanjiChart.css`に追加:

```css
.saved-handwriting-preview {
  border-radius: 4px;
}
```

**Step 3: コミット**

```bash
git add frontend/src/components/KanjiChart/KanjiChart.jsx
git add frontend/src/components/KanjiChart/KanjiChart.css
git commit -m "KanjiChartに手書き表示を追加

保存した手書き文字を漢字表の各セルに小さく表示。
進捗スタックを削除して手書きに置き換え。

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: データベースマイグレーション（H2）

**Files:**
- Modify: `backend/src/main/resources/schema.sql` (もし存在する場合)

**Note:** H2データベースは起動時に自動的にテーブルを作成するため、エンティティが正しく定義されていれば追加作業は不要です。

**Step 1: アプリケーションを起動してテーブル作成を確認**

```bash
cd backend
./mvnw spring-boot:run
```

ログで`CREATE TABLE saved_handwriting`が表示されることを確認。

**Step 2: H2コンソールで確認（オプション）**

ブラウザで http://localhost:8080/h2-console にアクセス:
- JDBC URL: `jdbc:h2:mem:testdb`
- ユーザー名: `sa`
- パスワード: (空欄)

以下のクエリでテーブルを確認:
```sql
SELECT * FROM saved_handwriting;
```

---

## Task 8: 統合テスト

**Step 1: バックエンドを起動**

```bash
cd backend
./mvnw spring-boot:run
```

**Step 2: フロントエンドを起動**

```bash
cd frontend
npm run dev
```

**Step 3: 手動テスト**

1. ログイン
2. 漢字ページを開く
3. 漢字をクリックして9マスグリッドを開く
4. 1つのマスに手書きで文字を書く
5. 「保存する」ボタンをクリック
6. 「保存しました！」メッセージが表示されることを確認
7. グリッドを閉じる
8. 漢字表ボタンをクリック
9. 該当の漢字セルに小さく手書き文字が表示されることを確認

**Step 4: 上書きテスト**

1. 同じ漢字の別のマスで手書き
2. 「保存する」ボタンをクリック
3. 「既に保存されています。上書きしますか？」ダイアログが表示されることを確認
4. 「OK」をクリック
5. 「保存しました！」メッセージが表示されることを確認
6. 漢字表で手書きが更新されていることを確認

**Step 5: 学年切り替えテスト**

1. 漢字表で2年生タブをクリック
2. 2年生の漢字で手書き保存
3. 1年生タブに戻る
4. 1年生の保存データのみ表示されることを確認

---

## 完了条件

- [ ] バックエンドAPIが正しく動作する
- [ ] 9マスグリッドに保存ボタンが表示される
- [ ] 保存ボタンクリックでデータが保存される
- [ ] 上書き時に確認ダイアログが表示される
- [ ] 漢字表に保存した手書きが表示される
- [ ] 学年別にデータがフィルタリングされる
- [ ] すべてのコミットが完了している

## トラブルシューティング

### バックエンドが起動しない

- JAVA_HOMEが設定されているか確認
- `./mvnw clean install`を実行してビルドエラーを確認

### データが保存されない

- ブラウザのコンソールでネットワークエラーを確認
- バックエンドのログでエラーメッセージを確認
- JWTトークンが正しく送信されているか確認

### 手書きが表示されない

- `getUserHandwritings`が正しくデータを返しているか確認
- `handwritingData` stateにデータが入っているか確認
- canvasの描画関数が正しく呼ばれているか確認
