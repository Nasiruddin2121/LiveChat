チャット機能の要約（日本語） <br />
本プラットフォームは チャット優先設計。患者・医師・ショップオーナーすべてが会話リストを基点に操作し、ダッシュボードはありません。 <br />
基本フロー：患者がブロードキャスト → 医師が回答して会話生成 → リアルタイムメッセージ → （必要なら）処方箋メッセージでショップオーナーへ自動配信。 <br />
主な REST API <br />
POST /chat/broadcast：患者の症状投稿  <br />
GET /chat/conversation / GET /chat/conversation/:id：会話一覧・詳細  <br />
GET /chat/message?conversation_id=...：メッセージ履歴・ページング  <br />
POST /chat/message：通常/処方箋メッセージ送信  <br />
GET /chat/shop-owner/prescriptions / GET /chat/shop-owner/conversations：ショップオーナー用の処方箋・会話取得  <br />
チャット開始までの手順  <br />
ログインと JWT  <br />
/auth/login でアクセストークンを取得。ユーザー種別（患者・医師・ショップオーナー）共通。  <br />
WebSocket 接続  <br /> 
ログイン直後に socket.io で auth.token = accessToken を付与して接続。これで会話・メッセージのリアルタイム通知を受信。  <br />
会話生成
患者：POST /chat/broadcast  <br />
医師：POST /chat/conversation/broadcast/:broadcastId/respond で特定ブロードキャストに参加し、新しい会話を生成。 <br />
会話・メッセージ取得  <br />
会話リスト：GET /chat/conversation  <br />
会話詳細：GET /chat/conversation/:id  <br />
メッセージ履歴：GET /chat/message?conversation_id=:id（limit/cursor でページング） <br />
WebSocket ルーム参加  <br />
joinRoom イベントに room_id = conversation_id を渡して参加。joinedRoom を受信すればタイムアウトなし。  <br />
メッセージ送信
POST /chat/message でテキストまたは message_type: "prescription" を送信。処方箋は全ショップオーナーへ自動配信。 <br />
ショップオーナー操作  <br />
GET /chat/shop-owner/prescriptions と GET /chat/shop-owner/conversations で処方箋/会話を取得し、必要に応じて返信。 <br />
この手順で README の他章を確認せずとも、チャット機能一式を把握し、実装・確認が可能です。
