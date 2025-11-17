チャット機能の要約（日本語）
本プラットフォームは チャット優先設計。患者・医師・ショップオーナーすべてが会話リストを基点に操作し、ダッシュボードはありません。
基本フロー：患者がブロードキャスト → 医師が回答して会話生成 → リアルタイムメッセージ → （必要なら）処方箋メッセージでショップオーナーへ自動配信。
主な REST API
POST /chat/broadcast：患者の症状投稿
GET /chat/conversation / GET /chat/conversation/:id：会話一覧・詳細
GET /chat/message?conversation_id=...：メッセージ履歴・ページング
POST /chat/message：通常/処方箋メッセージ送信
GET /chat/shop-owner/prescriptions / GET /chat/shop-owner/conversations：ショップオーナー用の処方箋・会話取得
チャット開始までの手順
ログインと JWT
/auth/login でアクセストークンを取得。ユーザー種別（患者・医師・ショップオーナー）共通。
WebSocket 接続
ログイン直後に socket.io で auth.token = accessToken を付与して接続。これで会話・メッセージのリアルタイム通知を受信。
会話生成
患者：POST /chat/broadcast
医師：POST /chat/conversation/broadcast/:broadcastId/respond で特定ブロードキャストに参加し、新しい会話を生成。
会話・メッセージ取得
会話リスト：GET /chat/conversation
会話詳細：GET /chat/conversation/:id
メッセージ履歴：GET /chat/message?conversation_id=:id（limit/cursor でページング）
WebSocket ルーム参加
joinRoom イベントに room_id = conversation_id を渡して参加。joinedRoom を受信すればタイムアウトなし。
メッセージ送信
POST /chat/message でテキストまたは message_type: "prescription" を送信。処方箋は全ショップオーナーへ自動配信。
ショップオーナー操作
GET /chat/shop-owner/prescriptions と GET /chat/shop-owner/conversations で処方箋/会話を取得し、必要に応じて返信。
この手順で README の他章を確認せずとも、チャット機能一式を把握し、実装・確認が可能です。
