import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

const TarotShuffleUI = () => {
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null); // { name: "カード名", image: "画像パス" } を保持
  const [fortuneMessage, setFortuneMessage] = useState('');

  const [customerReviews, setCustomerReviews] = useState([]);

  // 各タロットカードの名前と画像パスをマッピング
  const tarotCardsData = [
    { name: "愚者", image: "/images/fool.png" },
    { name: "魔術師", image: "/images/magician.png" },
    { name: "女教皇", image: "/images/high_priestess.png" },
    { name: "女帝", image: "/images/empress.png" },
    { name: "皇帝", image: "/images/emperor.png" },
    { name: "教皇", image: "/images/hierophant.png" },
    { name: "恋人", image: "/images/lovers.png" },
    { name: "戦車", image: "/images/chariot.png" },
    { name: "力", image: "/images/strength.png" },
    { name: "隠者", image: "/images/hermit.png" },
    { name: "運命の輪", image: "/images/wheel_of_fortune.png" },
    { name: "正義", image: "/images/justice.png" },
    { name: "吊られた男", image: "/images/hanged_man.png" },
    { name: "死神", image: "/images/death.png" },
    { name: "節制", image: "/images/temperance.png" },
    { name: "悪魔", image: "/images/devil.png" },
    { name: "塔", image: "/images/tower.png" },
    { name: "星", image: "/images/star.png" },
    { name: "月", image: "/images/moon.png" },
    { name: "太陽", image: "/images/sun.png" },
    { name: "審判", image: "/images/judgement.png" },
    { name: "世界", image: "/images/world.png" }
  ];

  // メッセージ部分はカード名で引けるようにする（変更なし）
  const tarotMessages = {
    "愚者": "今日は新しい冒険に最適な一日。予定にないことにも前向きに挑戦してみましょう。ラッキーアクションは、知らない道を散歩してみること。カジュアルな服装が吉。",
    "魔術師": "創造力と行動力が高まる日。ひらめきをすぐに形にすることで良い結果が得られます。ラッキーアイテムはメモ帳。ネイビー系の服装で集中力アップ。",
    "女教皇": "感情よりも理性を大切に。冷静な判断があなたを守ります。ラッキースポットは図書館やカフェ。白や水色の服が直感を高めてくれるでしょう。",
    "女帝": "愛や美に関することが満ちる日。感性を大切に過ごして。お気に入りの香りを身にまとうと魅力がアップ。優しい色の服が◎。",
    "皇帝": "リーダーシップが問われる場面が訪れそう。自信を持って行動して。ジャケットや固めのアイテムが運気を高めます。",
    "教皇": "誰かの助けになれる日。アドバイスを求められたら親身に応えて。クラシックな服装やベージュ系カラーが安定感を与えてくれます。",
    "恋人": "選択に迷う日。心の声に素直になるのがカギ。好きな音楽を聴きながらリラックスを。柔らかい素材の服が◎。",
    "戦車": "やる気とエネルギーに満ちた一日。積極的に行動を。赤系の差し色が活力を引き出します。短めの移動で吉が。",
    "力": "優しさがカギになる日。誰かを思いやることで運が味方します。淡いピンクやベージュの服が◎。手紙を書くのもおすすめ。",
    "隠者": "内省と静寂がテーマ。無理に外に出るより、自分と向き合う時間を大切に。読書や瞑想が◎。グレーやネイビーが心を整えます。",
    "運命の輪": "思わぬチャンスが舞い込む日。流れに逆らわず身を委ねて吉。ラッキーナンバーは5。ラッキーアイテムは時計。",
    "正義": "バランス感覚が問われる日。人とのやり取りには公平さを忘れずに。モノトーンの服装が運気を整えます。",
    "吊られた男": "努力が報われるには少し時間がかかりそう。今は忍耐の時。ストレッチや身体をほぐすことがおすすめ。深緑の服が◎。",
    "死神": "不要なものを手放すことで新たな流れが。思い切った整理整頓が吉。黒やダークカラーの服がリセットの助けに。",
    "節制": "バランスを意識すると安定した日になります。食事や休憩を大切に。ペールトーンの服装で調和を意識して。",
    "悪魔": "誘惑に負けそうな日。気持ちを引き締めて慎重に。スマホから少し離れるのが吉。黒系の服で自己統制を。",
    "塔": "急な変化があるかも。でもそれは好転のチャンス。気持ちを切り替える準備を。シルバーアクセが守りに。",
    "星": "希望が湧く日。未来を信じる気持ちが運を開きます。空を見上げる時間を持って。水色や白の服で清らかさを演出。",
    "月": "不安が心を揺さぶるかも。誰かに話すことで整理がつきます。落ち着いた照明の空間で過ごすのが吉。",
    "太陽": "明るく前向きに行動すれば運が開ける日。人と会う予定を入れて吉。オレンジや黄色のアイテムが幸運を引き寄せます。",
    "審判": "過去の出来事がヒントになる日。懐かしい人に連絡してみては。パールアクセが◎。白系の服で清々しい印象に。",
    "世界": "目標達成に近づく日。積み重ねてきたことを信じて◎。自然と触れ合うのも吉。青や緑の服がラッキー。"
  };

  useEffect(() => {
    // tarotCardsData からカードデータを取得して初期化
    const initialCards = Array.from({ length: tarotCardsData.length }, (_, i) => ({
      id: i,
      name: tarotCardsData[i].name,
      image: tarotCardsData[i].image, // ここで画像パスも保持
      rotation: Math.random() * 10 - 5,
      scatterX: 0,
      scatterY: 0,
      scale: 1,
    }));
    setCards(initialCards);
  }, []); // tarotCardsDataは定数なので依存配列には含めません

  useEffect(() => {
    const fixedReviewsData = [
      {
        month: "2025年6月",
        reviews: [
          { name: "A様", stars: "★★★★★", category: "恋愛・結婚", text: "相手の気持ちを的確に言語化していただき、心の整理が進みました。前向きな気持ちで行動を始められています。", gender: "女性", age: "32歳", date: "2025年6月" },
          { name: "K様", stars: "★★★★★", category: "仕事・キャリア", text: "将来に不安を感じていましたが、深い洞察から思いがけない視点を得ることができました。", gender: "女性", age: "38歳", date: "2025年6月" },
          { name: "S様", stars: "★★★★★", category: "人間関係", text: "モヤモヤしていた原因が明確になり、必要な行動が見えてきました。信頼できる鑑定でした。", gender: "女性", age: "27歳", date: "2025年6月" },
          { name: "T様", stars: "★★★★★", category: "金運・財運", text: "感情に振り回されていた理由を教えていただき、自分を俯瞰するきっかけになりました。", gender: "女性", age: "42歳", date: "2025年6月" },
          { name: "N様", stars: "★★★★★", category: "人生の方向性", text: "誰にも言えない悩みを受け止めてもらえて、安心感に包まれました。少しずつ前を向けそうです。", gender: "女性", age: "35歳", date: "2025年6月" },
          { name: "H様", stars: "★★★★★", category: "恋愛・結婚", text: "本当に望んでいた方向がわかり、今の迷いが意味あるものに感じられるようになりました。", gender: "女性", age: "39歳", date: "2025年6月" },
          { name: "M様", stars: "★★★★★", category: "仕事・キャリア", text: "ズバリ本質を突いていただき、驚きとともに納得しました。行動する勇気が湧いています。", gender: "女性", age: "31歳", date: "2025年6月" },
          { name: "Y様", stars: "★★★★★", category: "人間関係", text: "頭で考えても解決しなかった問題に、心の奥のテーマから向き合えた気がしています。", gender: "男性", age: "44歳", date: "2025年6月" },
          { name: "R様", stars: "★★★★★", category: "金運・財運", text: "迷ってばかりいた自分に、必要な言葉をいただき目が覚めました。", gender: "女性", age: "28歳", date: "2025年6月" },
          { name: "W様", stars: "★★★★★", category: "人生の方向性", text: "自分の中の矛盾を優しく指摘してくださり、気づけなかった視点を得られました。", gender: "女性", age: "40歳", date: "2025年6月" },
          { name: "C様", stars: "★★★★★", category: "恋愛・結婚", text: "何をしても空回りだった原因がわかり、心が軽くなりました。鑑定をお願いして本当に良かったです。", gender: "女性", age: "36歳", date: "2025年6月" },
          { name: "E様", stars: "★★★★★", category: "仕事・キャリア", text: "期待しすぎる自分を手放すヒントをもらい、人間関係が楽になりました。", gender: "女性", age: "41歳", date: "2025年6月" },
          { name: "G様", stars: "★★★★★", category: "人間関係", text: "親密になれない理由が明確になり、自分を変えるきっかけを得られました。", gender: "女性", age: "33歳", date: "2025年6月" },
          { name: "J様", stars: "★★★★★", category: "金運・財運", text: "気づかなかった本音を見つめ直せたことで、恋愛への向き合い方が変わりそうです。", gender: "女性", age: "26歳", date: "2025年6月" },
          { name: "A様", stars: "★★★★★", category: "人生の方向性", text: "焦る気持ちを静める言葉をいただき、冷静な判断ができるようになりました。", gender: "女性", age: "43歳", date: "2025年6月" },
          { name: "K様", stars: "★★★★★", category: "恋愛・結婚", text: "他人に合わせすぎていた自分に気づけて、自分の軸を取り戻し始めています。", gender: "女性", age: "34歳", date: "2025年6月" },
          { name: "S様", stars: "★★★★★", category: "仕事・キャリア", text: "将来への漠然とした不安が晴れ、今必要なことが見えるようになりました。", gender: "男性", age: "45歳", date: "2025年6月" },
          { name: "T様", stars: "★★★★★", category: "人間関係", text: "パターン化された思考から抜け出す糸口を見つけることができました。", gender: "女性", age: "37歳", date: "2025年6月" },
        ]
      },
      {
        month: "2025年5月",
        reviews: [
          { name: "N様", stars: "★★★★★", category: "金運・財運", text: "自分にしかない価値に気づけて、自信を取り戻すきっかけになりました。", gender: "女性", age: "34歳", date: "2025年5月" },
          { name: "H様", stars: "★★★★★", category: "人生の方向性", text: "本当の望みと違う方向に進んでいたことを、言葉にして教えていただきました。", gender: "女性", age: "41歳", date: "2025年5月" },
          { name: "M様", stars: "★★★★★", category: "恋愛・結婚", text: "諦めかけていた夢への希望が再燃し、再挑戦する気持ちになれました。", gender: "女性", age: "25歳", date: "2025年5月" },
          { name: "Y様", stars: "★★★★★", category: "仕事・キャリア", text: "一人で悩むしかなかったことが、誰かに理解されたことで心が救われました。", gender: "女性", age: "43歳", date: "2025年5月" },
          { name: "R様", stars: "★★★★★", category: "人間関係", text: "思考の癖を見抜いてもらい、新しい考え方に挑戦できるようになりました。", gender: "男性", age: "30歳", date: "2025年5月" },
          { name: "W様", stars: "★★★★★", category: "金運・財運", text: "人生の選択に自信が持てるようになり、勇気ある決断ができました。", gender: "女性", age: "39歳", date: "2025年5月" },
          { name: "C様", stars: "★★★★★", "category": "人生の方向性", text: "愛されない理由を外側に求めていたことに気づき、自分を愛せるようになれました。", gender: "女性", age: "36歳", date: "2025年5月" },
          { name: "E様", stars: "★★★★★", category: "恋愛・結婚", text: "心のどこかで感じていた違和感を丁寧に拾っていただき、とても腑に落ちました。", gender: "女性", age: "42歳", date: "2025年5月" },
          { name: "G様", stars: "★★★★★", category: "仕事・キャリア", text: "言葉にできなかった苦しみを代弁してもらえて、涙が止まりませんでした。", gender: "女性", age: "29歳", date: "2025年5月" },
          { name: "J様", stars: "★★★★★", category: "人間関係", text: "不安を見つめることから始める勇気をもらいました。感謝しています。", gender: "男性", age: "45歳", date: "2025年5月" },
          { name: "A様", stars: "★★★★★", category: "金運・財運", text: "繰り返していた失敗の根本原因がわかり、次こそは変われる気がしています。", gender: "女性", age: "31歳", date: "2025年5月" },
          { name: "K様", "stars": "★★★★★", category: "人生の方向性", text: "決断のタイミングを見極めるヒントをいただき、迷いが晴れました。", gender: "女性", age: "40歳", date: "2025年5月" },
          { name: "S様", stars: "★★★★★", category: "恋愛・結婚", text: "未来への不安を希望に変えるような、温かな言葉をいただきました。", gender: "女性", age: "33歳", date: "2025年5月" },
           { name: "T様", stars: "★★★★★", category: "仕事・キャリア", text: "否定的な思考に飲まれていた日々から抜け出すきっかけをいただきました。", gender: "男性", age: "27歳", date: "2025年5月" },
          { name: "N様", stars: "★★★★★", category: "人間関係", text: "執着していたものを手放す大切さに気づき、心の余裕が生まれました。", gender: "女性", age: "38歳", date: "2025年5月" },
          { name: "H様", stars: "★★★★★", category: "金運・財運", text: "忘れていた夢を思い出すきっかけとなる鑑定でした。ありがとうございました。", gender: "女性", age: "32歳", date: "2025年5月" },
          { name: "M様", stars: "★★★★★", category: "人生の方向性", text: "自分では気づけなかった本音を知り、大切な気づきに繋がりました。", gender: "女性", age: "44歳", date: "2025年5月" },
          { name: "Y様", stars: "★★★★★", category: "恋愛・結婚", text: "一人では乗り越えられなかったと思います。背中を押してくださり感謝しています。", gender: "女性", age: "35歳", date: "2025年5月" },
        ]
      }
    ];

    setCustomerReviews(fixedReviewsData);
  }, []);

  const shuffleAndDrawCard = () => {
    if (isShuffling || hasShuffled) return;
    setIsShuffling(true);

    const stage1 = () => {
      setCards(prev => prev.map(card => ({
        ...card,
        rotation: Math.random() * 60 - 30,
        scatterX: (Math.random() - 0.5) * 300,
        scatterY: (Math.random() - 0.5) * 200,
        scale: 0.9
      })));
    };
    const stage2 = () => {
      setCards(prev => prev.map(card => ({
        ...card,
        scatterX: 0,
        scatterY: 0,
        scale: 1,
        rotation: Math.random() * 10 - 5
      })));
    };
    const stage3 = () => {
      const randomIndex = Math.floor(Math.random() * tarotCardsData.length); // tarotCardsDataから選択
      const drawnCardData = tarotCardsData[randomIndex]; // カードデータ全体を取得
      setSelectedCard(drawnCardData); // { name: "カード名", image: "画像パス" } のオブジェクトをセット
      setFortuneMessage(tarotMessages[drawnCardData.name]); // メッセージはnameで取得
      setIsShuffling(false);
      setHasShuffled(true);
    };

    stage1();
    setTimeout(stage2, 800);
    setTimeout(stage3, 1600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-8">
      {/* 🔮 今日の運勢を占うセクション */}
      <div className="text-center mt-8 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-1 whitespace-nowrap"> {/* ここを変更 */}
          <Sparkles className="text-yellow-300" />
          今日の運勢を占う
          <Sparkles className="text-yellow-300" />
        </h1>
        <p className="text-purple-200 text-lg mt-6">
          1日1回カードを引いて、あなたへのメッセージを受け取ましょう。
        </p>
      </div>

      <div className="relative w-96 h-[28rem] mb-6">
        {!selectedCard && (
          cards.map((card, index) => (
            <div
              key={card.id}
              className="absolute w-28 h-40 bg-gradient-to-br from-purple-700 to-indigo-700 border-2 border-yellow-300 rounded-lg shadow-xl transition-all duration-700 cursor-pointer"
              style={{
                left: `calc(50% - 56px + ${card.scatterX}px)`,
                top: `calc(50% - 80px + ${card.scatterY}px)`,
                transform: `rotate(${card.rotation}deg) scale(${card.scale})`,
                zIndex: 100 - index
              }}
              onClick={shuffleAndDrawCard}
            >
              {/* シャッフル中のカードは「TAROT」の文字を表示 */}
              <div className="w-full h-full flex items-center justify-center text-yellow-200 font-bold text-sm">
                TAROT
              </div>
            </div>
          ))
        )}

        {selectedCard && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-slow">
            {/* 選択されたカードのみ画像を表示 */}
            <div className="card-display-area flex items-center justify-center text-center text-lg font-bold text-yellow-200 transition-opacity duration-1000 opacity-0 animate-fade-in-slow overflow-hidden">
              <img
                src={selectedCard.image} // 選択されたカードの画像パス
                alt={selectedCard.name}
                className="selected-card-image"
              />
            </div>
            {/* ここにカード名称を追加 (画像とメッセージの間) */}
            <p className="text-yellow-300 text-2xl font-bold mt-8 mb-4 animate-fade-in-slow">
              【{selectedCard.name}】のカード
            </p>
            {/* メッセージ */}
            <p className="text-purple-100 text-base max-w-xs animate-fade-in-slow">
              {fortuneMessage}
            </p>
          </div>
        )}
      </div>

      {!hasShuffled ? (
        <button
          onClick={shuffleAndDrawCard}
          disabled={isShuffling}
          className="px-10 py-5 rounded-full font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
        >
          {isShuffling ? 'カードを引いています...' : 'シャッフルしてカードを引く'}
        </button>
      ) : (
        <a
          href="https://lin.ee/YqR4tbD" // ここをあなたのLINE公式アカウントのURLに置き換えてください
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-md px-10 py-4 rounded-full font-bold text-lg bg-green-500 text-white shadow-lg hover:bg-green-400 transition-all duration-300 text-center"
        >
          <span role="img" aria-label="line-icon">▶︎</span> LINEに戻って【個別鑑定書】を依頼する
        </a>
      )}

      {/* 💬 お客様の声セクション */}
      <div className="mt-16 max-w-5xl w-full">
        <h2 className="text-3xl font-bold text-white mb-1 text-center">💬 お客様の声</h2>
        <p className="text-center text-base text-purple-200 mt-4 mb-8">有料鑑定をご依頼いただいたお客様からの声</p>
        {customerReviews.map(monthData => (
          <div key={monthData.month} className="mb-8">
            <h3 className="text-2xl font-bold text-white text-center mb-6 py-2 border-b border-t border-purple-500">{monthData.month}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthData.reviews.map((review, reviewIndex) => (
                <div
                    key={reviewIndex}
                    className="bg-gradient-to-b from-white/20 to-transparent text-white p-4 rounded-lg shadow-md min-h-[200px] flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-lg text-indigo-200 font-bold whitespace-nowrap">{review.name} ({review.age}{review.gender ? `・${review.gender}` : ''})</p>
                      <p className="text-yellow-300 text-sm">{review.stars}</p>
                    </div>
                    <p className="text-xs text-indigo-200 font-semibold mt-2 mb-1">【{review.category}】</p>
                    <p className="text-sm leading-relaxed flex-grow mt-2">{review.text}</p>
                    <p className="text-xs text-purple-300 mt-auto">{review.date}</p>
                  </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 誘導メッセージとLINEボタン (重複しますが、あえてもう一度置いてLPのCTAを強化しています) */}
      <div className="mt-20 pb-20 text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <h2 className="font-bold text-white mb-6 whitespace-nowrap
             text-xl
             sm:text-2xl
             md:text-3xl
             lg:text-4xl
             xl:text-5xl
             leading-tight
             ">
            あなたの未来を占ってみませんか？
          </h2>
        </div>
        <p className="text-white text-xl mb-6 mt-6">
          タロットはあくまで今日のエネルギー傾向を示すヒントです。
          <br />
          本当に悩んでいることがある方は、【個別鑑定書】で<br />
          「原因の本質」や「今すぐ取るべき具体的な行動」をお伝えしています。
        </p>
        <div className="flex justify-center mt-10"> {/* ここがLINEボタンの上のスペースです */}
          <a
            href="https://lin.ee/YqR4tbD"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-md px-10 py-4 rounded-full font-bold text-lg bg-green-500 text-white shadow-lg hover:bg-green-400 transition-all duration-300 text-center"
          >
            <span role="img" aria-label="line-icon">▶︎</span> LINEに戻って【個別鑑定書】を依頼する
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeInSlow {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-slow {
          animation: fadeInSlow 1.5s ease-out forwards;
        }

        .card-display-area {
          width: 300px; 
          height: 500px; 
        }

        .selected-card-image {
          width: 100%; 
          height: 100%; 
          object-fit: contain; 
        }
      `}</style>
    </div>
  );
};

export default TarotShuffleUI;