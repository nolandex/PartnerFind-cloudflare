import { useState } from "react";
import { Share2, Percent, HandCoins, Wallet, MessageCircle, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "../components/LanguageSwitcher";
import type { Locale } from "../lib/translations";

// Halaman Mitra Referral PartnerFind (URL /referral) — 10 bahasa,
// mengikuti bahasa yang dipilih pengunjung di situs. Berisi penjelasan
// singkat Mitra Referral,
// langkah, aturan imbalan (50% biaya pendaftaran + hingga 50% komisi
// platform, selamanya), pesan undangan siap salin, dan kontak admin
// untuk penarikan imbalan.

const ADMIN_WA =
  "https://wa.me/6289691685228?text=Halo%20owner%20PartnerFind%2C%20saya%20mau%20bertanya%20tentang%20Mitra%20Referral";
const SITE_LINK = "https://partnerfind.ai.id";
const BOT_LINK = "https://t.me/Partnerfindreal_bot";

const MSG_BASE = "https://partnerfind-menu.partnerfind.workers.dev";
const MSG_MEDIA: { img?: string; full?: string; name?: string }[] = [
  { img: "/MitraPesan1.webp", full: "/MitraPesan1.png", name: "PartnerFind-Pesan-1.png" },
  { img: `${MSG_BASE}/MitraPesan2.webp`, full: "/MitraPesan2.png", name: "PartnerFind-Pesan-2.png" },
  { img: `${MSG_BASE}/MitraManfaat.webp`, full: "/MitraManfaat.png", name: "PartnerFind-Pesan-3.png" },
  { img: `${MSG_BASE}/MitraPesan3.webp`, full: "/MitraPesan3.png", name: "PartnerFind-Pesan-4.png" },
];
const MSG_TEXTS: Record<Locale, string[]> = {
  "id-ID": [
    "Chat orang yang kamu kenal — ada undangan platform yang bermanfaat untuk peluang ekonomi.",
    "Ini undangan dari PartnerFind, platform yang menghubungkan pencari & pemberi peluang (bisnis, investasi, pekerjaan, proyek, jasa, properti dan lainnya).\n\nCara bergabung:\n1. Daftar: https://tally.so/r/WJJ1dv\n2. Kami mencocokkan Pencari dan Pemberi Peluang berdasarkan kebutuhan dan profil kalian.\n3. Kami buatkan grup chat dan bantu kalian sampai sepakat.\n\nInfo: https://partnerfind.ai.id/",
    "Beri metode pembayaran dari owner",
    "Tanyakan mau gabung atau ngga — mau didata dan dilaporkan ke platform — dan minta tolong share dan data juga ke orang dikenal karena 100% anggota jalur undangan",
  ],
  "en-US": [
    "Chat with people you know — there's an invitation to a platform that's useful for economic opportunities.",
    "You're invited by PartnerFind — the platform that connects opportunity seekers & providers (business, investment, jobs, projects, services, property, etc.).\n\nHow to join:\n1. Sign up: https://tally.so/r/yXX7jB\n2. We match Opportunity Seekers and Providers based on your needs and profiles.\n3. We set up a chat group for you and help you until you reach an agreement.\n\nInfo: https://partnerfind.ai.id/",
    "Give the payment method from the owner.",
    "Ask whether they want to join or not — want to be recorded and reported to the platform — and ask them to please share and also pass data to people they know, because 100% of members come through invitations.",
  ],
  "es-ES": [
    "Chatea con personas que conoces: hay una invitación a una plataforma útil para oportunidades económicas.",
    "Tienes una invitación de PartnerFind, la plataforma que conecta a buscadores y oferentes de oportunidades (negocios, inversión, empleo, proyectos, servicios, inmuebles, etc.).\n\nCómo unirte:\n1. Regístrate: https://tally.so/r/VppxbJ\n2. Emparejamos a Buscadores y Proveedores de Oportunidades según sus necesidades y perfiles.\n3. Creamos un grupo de chat para ustedes y les ayudamos hasta que lleguen a un acuerdo.\n\nInfo: https://partnerfind.ai.id/",
    "Entrega el método de pago del propietario.",
    "Pregunta si quiere unirse o no — quiere ser registrado y reportado a la plataforma — y pídele que comparta y también pase datos a personas que conoce, porque el 100% de los miembros llega por invitación.",
  ],
  "ja-JP": [
    "知り合いにチャットしよう — 経済的なチャンスに役立つプラットフォームへの招待があるよ。",
    "PartnerFindからの招待です。機会を探す人と提供する人（ビジネス、投資、仕事、プロジェクト、サービス、不動産など）をつなぐプラットフォームです。\n\n参加方法：\n1. 登録：https://tally.so/r/2jjRDV\n2. ニーズとプロフィールに基づいて、機会を探す人と提供する人をマッチングします。\n3. チャットグループを作成し、合意に至るまでお手伝いします。\n\n詳細：https://partnerfind.ai.id/",
    "オーナーの支払い方法を渡してね。",
    "参加するかどうか聞いて — データに記録してプラットフォームに報告してほしいか聞いて — 知り合いにもシェアとデータ提供をお願いして。会員の100%が招待経由だから。",
  ],
  "fr-FR": [
    "Discute avec des personnes que tu connais — il y a une invitation à une plateforme utile pour les opportunités économiques.",
    "Voici une invitation de PartnerFind, la plateforme qui met en relation chercheurs et offreurs d'opportunités (affaires, investissement, emploi, projets, services, immobilier, etc.).\n\nComment rejoindre :\n1. Inscription : https://tally.so/r/ArrQjk\n2. Nous apparions les Chercheurs et les Fournisseurs d'Opportunités selon vos besoins et vos profils.\n3. Nous créons un groupe de discussion pour vous et vous aidons jusqu'à ce que vous parveniez à un accord.\n\nInfos : https://partnerfind.ai.id/",
    "Donne le moyen de paiement du propriétaire.",
    "Demande s'il veut rejoindre ou non — veut être enregistré et signalé à la plateforme — et demande-lui de partager et aussi de transmettre des données à des personnes qu'il connaît, car 100 % des membres arrivent par invitation.",
  ],
  "ar-SA": [
    "تحدث مع أشخاص تعرفهم — هناك دعوة إلى منصة مفيدة للفرص الاقتصادية.",
    "لديك دعوة من PartnerFind، المنصة التي تربط بين الباحثين عن الفرص ومقدميها (أعمال، استثمار، وظائف، مشاريع، خدمات، عقارات، إلخ).\n\nكيفية الانضمام:\n1. التسجيل: https://tally.so/r/vXXWzA\n2. نطابق الباحثين عن الفرص ومقدّميها بناءً على احتياجاتكم وملفاتكم.\n3. ننشئ لكم مجموعة محادثة ونساعدكم حتى تصلوا إلى اتفاق.\n\nالمعلومات: https://partnerfind.ai.id/",
    "أعطِ وسيلة الدفع من المالك.",
    "اسأل إن كان يريد الانضمام أم لا — يريد أن تُسجَّل بياناته ويُبلَّغ عنه إلى المنصة — واطلب منه المشاركة وتمرير البيانات أيضًا إلى أشخاص يعرفهم، لأن 100% من الأعضاء يأتون عبر الدعوات.",
  ],
  "ru-RU": [
    "Напиши своим знакомым — есть приглашение на платформу, полезную для экономических возможностей.",
    "Для вас приглашение от PartnerFind — платформы, которая соединяет ищущих и предлагающих возможности (бизнес, инвестиции, работа, проекты, услуги, недвижимость и др.).\n\nКак присоединиться:\n1. Регистрация: https://tally.so/r/o99xv1\n2. Мы сопоставляем искателей и поставщиков возможностей на основе ваших потребностей и профилей.\n3. Мы создаём для вас чат-группу и помогаем вам, пока вы не достигнете соглашения.\n\nПодробнее: https://partnerfind.ai.id/",
    "Дай способ оплаты от владельца.",
    "Спроси, хочет ли он присоединиться или нет — хочет ли, чтобы его данные записали и передали платформе, — и попроси поделиться и тоже передать данные знакомым, потому что 100% участников приходят по приглашениям.",
  ],
  "ko-KR": [
    "아는 사람들에게 채팅해 봐 — 경제적 기회에 도움이 되는 플랫폼 초대가 있어.",
    "PartnerFind의 초대입니다. 기회를 찾는 사람과 제공하는 사람(비즈니스, 투자, 일자리, 프로젝트, 서비스, 부동산 등)을 연결하는 플랫폼입니다.\n\n가입 방법:\n1. 가입: https://tally.so/r/7XXPPL\n2. 여러분의 필요와 프로필을 바탕으로 기회 탐색자와 제공자를 매칭합니다.\n3. 여러분을 위해 채팅 그룹을 만들고, 합의에 이를 때까지 돕습니다.\n\n정보: https://partnerfind.ai.id/",
    "오ーナーの 결제 수단을 전달해 줘.",
    "가입할지 안 할지 물어봐 — 데이터로 기록되고 플랫폼에 보고되길 원하는지 물어봐 — 아는 사람들에게 공유와 데이터 제공도 부탁해. 회원의 100%가 초대를 통해 오니까.",
  ],
  "pt-PT": [
    "Fala com pessoas que conheces — há um convite para uma plataforma útil para oportunidades económicas.",
    "Tem um convite da PartnerFind, a plataforma que conecta quem procura e quem oferece oportunidades (negócios, investimento, emprego, projetos, serviços, imobiliário, etc.).\n\nComo aderir:\n1. Registo: https://tally.so/r/gbbOON\n2. Combinamos Procuradores e Fornecedores de Oportunidades com base nas vossas necessidades e perfis.\n3. Criamos um grupo de chat para vocês e ajudamos até chegarem a um acordo.\n\nInfo: https://partnerfind.ai.id/",
    "Entrega o método de pagamento do proprietário.",
    "Pergunta se quer aderir ou não — quer ser registado e reportado à plataforma — e pede-lhe que partilhe e também passe dados a pessoas que conhece, porque 100% dos membros chegam por convite.",
  ],
  "zh-CN": [
    "和你认识的人聊聊——有一个对经济机会有帮助的平台邀请。",
    "这是来自 PartnerFind 的邀请——这个平台连接寻找机会的人和提供机会的人（商业、投资、就业、项目、服务、房地产等）。\n\n如何加入：\n1. 注册：https://tally.so/r/ArzAvB\n2. 我们根据你们的需求和资料，匹配机会寻找者与提供者。\n3. 我们为你们创建聊天群组，并帮助你们直到达成协议。\n\n详情：https://partnerfind.ai.id/",
    "把所有者的支付方式给对方。",
    "问对方要不要加入——想不想被登记并上报给平台——也请对方分享给认识的人并提供数据，因为100%的成员都是通过邀请加入的。",
  ],
};

function NumBadge({ n }: { n: number }) {
  return (
    <div
      className="relative z-10 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 shrink-0 rounded-full border border-white/20 font-mono"
      style={{
        background: "hsl(var(--brand-accent))",
        boxShadow: "0 4px 12px hsl(var(--brand-accent)/0.35)",
      }}
    >
      <span className="text-white font-black text-xs leading-none">{n}</span>
    </div>
  );
}

type PageStrings = {
  title: string;
  home: string;
  intro: string;
  howTitle: string;
  steps: string[];
  rulesTitle: string;
  step1Title: string;
  step2Title: string;
  s2Title: string;
  s2Text: string;
  s4Title: string;
  s4Text: string;
  step1Text: string;
  step3Title: string;
  step3Text: string;
  notesTitle: string;
  downloadImage: string;
  msgLabel: string;
  rules: string[];
  inviteTitle: string;
  inviteText: string;
  copy: string;
  copied: string;
  shareLabel: string;
  withdrawTitle: string;
  withdrawButton: string;
  chatAdmin: string;
  telegramNote: string;
  simTitle: string;
  simIntro: string;
  simLines: { text: string; amount: string }[];
  simNote: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  heroJoin: string;
  heroFree: string;
  ctaJoin: string;
  getTitle: string;
  getPoint3: string;
  feeAsk: string;
  earnTitle: string;
  joinTitle: string;
  joinStep1: string;
  joinStep2: string;
  joinStep3: string;
  trustTitle: string;
  inviteOnly: string;
  faqModalQ: string;
  faqModalA: string;
  faqTimeQ: string;
  faqTimeA: string;
  faqSafeQ: string;
  faqSafeA: string;
};

const STRINGS: Record<string, PageStrings> = {
  "id-ID": {
    title: "Mitra Referral",
    heroJoin: "Jadi Mitra PartnerFind",
    heroFree: "Gratis bergabung, mulai dalam 2 menit.",
    ctaJoin: "Chat Sekarang",
    getTitle: "Apa yang Kamu Dapatkan",
    getPoint3: "Gratis bergabung. Tarik imbalan kapan saja, tanpa minimal",
    feeAsk: "Biaya pendaftaran tanya admin.",
    earnTitle: "Cara Kamu Mendapat Penghasilan",
    joinTitle: "3 Langkah Bergabung",
    joinStep1: "Hubungi owner dan daftar sebagai Mitra Referral",
    joinStep2: "Dapatkan panduan dari admin",
    joinStep3: "Mulai",
    trustTitle: "Bukti dan Kepercayaan",
    inviteOnly: "Bukan untuk umum — hanya lewat undangan.",
    faqModalQ: "Butuh modal atau pengalaman?",
    faqModalA: "Tidak. Kamu cukup mengundang orang yang kamu kenal — tanpa modal, tanpa pengalaman, tanpa jualan.",
    faqTimeQ: "Berapa waktu yang dibutuhkan?",
    faqTimeA: "Mulai dalam 2 menit: chat owner, terima pesan undangan, lalu bagikan ke orang yang kamu kenal kapan pun kamu sempat.",
    faqSafeQ: "Apakah ini aman?",
    faqSafeA: "Aman. Pendaftaran lewat tautan resmi PartnerFind, dan imbalan diproses langsung oleh owner secara manual — bukan oleh pihak ketiga.",
    step1Title: "Hubungi Owner",
    step2Title: "Pesan yang Dibagikan ke Orang yang Kamu Kenal",
    s2Title: "Bagikan Undangan", s2Text: "Sapa dan chat orang yang kamu kenal, lalu sampaikan bahwa ada undangan platform yang bermanfaat untuk peluang ekonomi.", s4Title: "Minta dan Teruskan Metode Pembayaran", s4Text: "Minta metode pembayaran ke Owner, lalu teruskan ke orang yang kamu kenal.",
    notesTitle: "Skema Penghasilan",
    downloadImage: "Unduh Gambar",
    msgLabel: "Pesan",
    home: "Beranda",
    intro:
      "Dapatkan penghasilan dari setiap orang yang kamu undang. Bergabung gratis, imbalan bisa ditarik kapan saja.",
    howTitle: "Cara Kerja",
    steps: [
      "Buat grup chat bernama PartnerFind.",
      "Undang orang terdekatmu.",
      "Kirim pesan undangan di bawah ini ke grupmu.",
      "Minta anggota grup ikut membagikannya ke kenalan mereka.",
      "Grup penuh? Buat grup baru.",
    ],
    rulesTitle: "Aturan",
    rules: [
      "Biaya pendaftaran ditentukan oleh pendaftar sendiri atau Mitra Referral yang mengundang.",
      "50% dari biaya pendaftaran setiap orang yang kamu undang",
      "Hingga 50% komisi platform setiap kali orang yang kamu undang berhasil deal",
    ],
    inviteTitle: "Pesan Undangan",
    inviteText:
      "PartnerFind menghubungkan pencari peluang ekonomi dengan pemberi peluang.\n\n" +
      `Daftar lewat situs kami: ${SITE_LINK}`,
    copy: "Salin Pesan",
    copied: "Tersalin ✓",
    shareLabel: "Bagikan",
    step1Text: "Chat owner lewat tombol di bawah ini untuk mulai jadi Mitra Referral.",
    step3Title: "Terima imbalanmu",
    step3Text: "Setiap orang yang kamu undang menghasilkan imbalan untukmu sesuai skema di bawah ini. Imbalan bisa ditarik lewat chat owner.",
        simTitle: "Contoh Simulasi",
    simIntro: "Undang 1.000 orang:",
    simLines: [
      { text: "Biaya daftar Rp1.000 → kamu dapat", amount: "Rp500.000" },
      { text: "Biaya daftar Rp10.000 → kamu dapat", amount: "Rp5.000.000" },
    ],
    simNote: "Itu belum termasuk hingga 50% komisi platform dari setiap kesepakatan mereka.",
    faqTitle: "FAQ",
    faqs: [
      { q: "Apakah gratis jadi Mitra Referral?", a: "Ya, gratis. Tanpa biaya untuk bergabung." },
      { q: "Kapan imbalan bisa ditarik?", a: "Kapan saja, tanpa minimal. Klik Hubungi Owner, lalu imbalanmu diproses manual." },
      { q: "Apa arti “berhasil deal”?", a: "Pencari Peluang dan Pemberi Peluang yang kamu undang sepakat dan menghasilkan uang. Platform mengambil komisi dari situ, dan kamu mendapat hingga 50% dari komisi tersebut." },
    ],
    withdrawButton: "Hubungi Owner",
    withdrawTitle: "Tarik Imbalan",
    chatAdmin: "Chat Owner",
    telegramNote: "Program yang sama juga tersedia di Telegram:",
  },
  "en-US": {
    title: "Referral Partner",
    heroJoin: "Become a PartnerFind Referral Partner.",
    heroFree: "Free to join, start in 2 minutes.",
    ctaJoin: "Chat Now",
    getTitle: "What You Get",
    getPoint3: "Free to join. Withdraw your rewards anytime, with no minimum",
    feeAsk: "Registration fee — ask the admin.",
    earnTitle: "How You Earn",
    joinTitle: "3 Steps to Join",
    joinStep1: "Contact the owner and register as a Referral Partner",
    joinStep2: "Get guidance from the admin",
    joinStep3: "Start",
    trustTitle: "Proof and Trust",
    inviteOnly: "Not open to the public — by invitation only.",
    faqModalQ: "Do I need capital or experience?",
    faqModalA: "No. You simply invite people you know — no capital, no experience, no selling.",
    faqTimeQ: "How much time does it take?",
    faqTimeA: "Start in 2 minutes: chat the owner, receive the invitation message, then share it with people you know whenever you have time.",
    faqSafeQ: "Is this safe?",
    faqSafeA: "Yes. Registration goes through PartnerFind's official links, and rewards are processed manually and directly by the owner — not by any third party.",
    step1Title: "Contact the Owner",
    step2Title: "Message Shared with People You Know",
    s2Title: "Share the Invitation", s2Text: "Greet and chat with people you know, then tell them there is an invitation to a platform that is useful for economic opportunities.", s4Title: "Ask for and Forward the Payment Method", s4Text: "Ask the Owner for the payment method, then forward it to the person you know.",
    notesTitle: "Income Scheme",
    downloadImage: "Download Image",
    msgLabel: "Message",
    home: "Home",
    intro:
      "Earn from every person you invite. Joining is free, and rewards can be withdrawn anytime.",
    howTitle: "How It Works",
    steps: [
      "Create a chat group named PartnerFind.",
      "Invite the people closest to you.",
      "Send the invitation message below to your group.",
      "Ask group members to share it with their contacts too.",
      "Group full? Create a new group.",
    ],
    rulesTitle: "Rules",
    rules: [
      "The registration fee is set by the registrant themselves or by the inviting Referral Partner.",
      "50% of the registration fee of every person you invite",
      "Up to 50% of the platform commission every time someone you invited closes a deal",
    ],
    inviteTitle: "Invitation Message",
    inviteText:
      "PartnerFind connects people seeking economic opportunities with those who offer them.\n\n" +
      `Sign up through our website: ${SITE_LINK}`,
    copy: "Copy Message",
    copied: "Copied ✓",
    shareLabel: "Share",
    step1Text: "Chat the owner using the button below to get started as a Referral Partner.",
    step3Title: "Receive Your Rewards",
    step3Text: "Every person you invite earns you rewards under the scheme below. Rewards can be withdrawn through the owner chat.",
        simTitle: "Simulation Examples",
    simIntro: "Invite 1,000 people:",
    simLines: [
      { text: "Registration fee $1 → you get", amount: "$500" },
      { text: "Registration fee $10 → you get", amount: "$5,000" },
    ],
    simNote: "That does not include up to 50% of the platform commission from every agreement they reach.",
    faqTitle: "FAQ",
    faqs: [
      { q: "Is it free to become a Referral Partner?", a: "Yes, free. There is no fee to join." },
      { q: "When can I withdraw my rewards?", a: "Anytime, with no minimum. Tap Contact the Owner, and your rewards will be processed manually." },
      { q: "What does “closing a deal” mean?", a: "The Opportunity Seeker and Opportunity Provider you invited reach an agreement and generate money. The platform takes a commission from that, and you get up to 50% of that commission." },
    ],
    withdrawButton: "Contact the Owner",
    withdrawTitle: "Withdraw Rewards",
    chatAdmin: "Chat Owner",
    telegramNote: "The same program is also available on Telegram:",
  },
  "es-ES": {
    title: "Socio de Referidos",
    heroJoin: "Conviértete en Socio de Referidos de PartnerFind.",
    heroFree: "Gratis, empieza en 2 minutos.",
    ctaJoin: "Chatea ahora",
    getTitle: "Lo que obtienes",
    getPoint3: "Gratis para unirse. Retira tus recompensas en cualquier momento, sin mínimo",
    feeAsk: "Cuota de registro: pregunta al administrador.",
    earnTitle: "Cómo ganas",
    joinTitle: "3 pasos para unirte",
    joinStep1: "Contacta al propietario y regístrate como Socio de Referidos",
    joinStep2: "Recibe la guía del administrador",
    joinStep3: "Empieza",
    trustTitle: "Prueba y confianza",
    inviteOnly: "No es para el público — solo por invitación.",
    faqModalQ: "¿Necesito capital o experiencia?",
    faqModalA: "No. Solo invitas a personas que conoces — sin capital, sin experiencia, sin vender nada.",
    faqTimeQ: "¿Cuánto tiempo lleva?",
    faqTimeA: "Empieza en 2 minutos: escribe al propietario, recibe el mensaje de invitación y compártelo con tus conocidos cuando tengas tiempo.",
    faqSafeQ: "¿Es seguro?",
    faqSafeA: "Sí. El registro es por los enlaces oficiales de PartnerFind y las recompensas las procesa el propietario directamente, de forma manual — ningún tercero.",
    step1Title: "Contacta al Propietario",
    step2Title: "Mensaje Compartido con Personas que Conoces",
    s2Title: "Comparte la Invitación", s2Text: "Saluda y chatea con personas que conoces, y luego cuéntales que hay una invitación a una plataforma útil para oportunidades económicas.", s4Title: "Pide y Reenvía el Método de Pago", s4Text: "Pide el método de pago al Propietario y luego reenvíalo a la persona que conoces.",
    notesTitle: "Esquema de Ingresos",
    downloadImage: "Descargar Imagen",
    msgLabel: "Mensaje",
    home: "Inicio",
    intro:
      "Gana con cada persona que invites. Unirse es gratis y las recompensas se pueden retirar en cualquier momento.",
    howTitle: "Cómo Funciona",
    steps: [
      "Crea un grupo de chat llamado PartnerFind.",
      "Invita a las personas más cercanas a ti.",
      "Envía el mensaje de invitación de abajo a tu grupo.",
      "Pide a los miembros del grupo que lo compartan con sus conocidos.",
      "¿Grupo lleno? Crea un grupo nuevo.",
    ],
    rulesTitle: "Reglas",
    rules: [
      "La cuota de registro la define el propio registrante o el Socio de Referidos que lo invita.",
      "50% de la cuota de registro de cada persona que invites",
      "Hasta el 50% de la comisión de la plataforma cada vez que una persona que invitaste cierra un trato",
    ],
    inviteTitle: "Mensaje de Invitación",
    inviteText:
      "PartnerFind conecta a quienes buscan oportunidades económicas con quienes las ofrecen.\n\n" +
      `Regístrate en nuestro sitio web: ${SITE_LINK}`,
    copy: "Copiar Mensaje",
    copied: "Copiado ✓",
    shareLabel: "Compartir",
    step1Text: "Chatea con el propietario con el botón de abajo para empezar como Socio de Referidos.",
    step3Title: "Recibe tus Recompensas",
    step3Text: "Cada persona que invites te genera recompensas según el esquema de abajo. Las recompensas se retiran por el chat con el propietario.",
        simTitle: "Ejemplos de Simulación",
    simIntro: "Invita a 1.000 personas:",
    simLines: [
      { text: "Cuota de registro 1 € → recibes", amount: "500 €" },
      { text: "Cuota de registro 10 € → recibes", amount: "5.000 €" },
    ],
    simNote: "Eso no incluye hasta el 50% de la comisión de la plataforma por cada acuerdo que alcancen.",
    faqTitle: "FAQ",
    faqs: [
      { q: "¿Es gratis ser Socio de Referidos?", a: "Sí, gratis. Sin ningún costo por unirse." },
      { q: "¿Cuándo puedo retirar mis recompensas?", a: "En cualquier momento, sin mínimo. Toca Contacta al Propietario y tus recompensas se procesarán manualmente." },
      { q: "¿Qué significa “cerrar un trato”?", a: "El Buscador de Oportunidades y el Proveedor de Oportunidades que invitaste llegan a un acuerdo y generan dinero. La plataforma toma una comisión de ahí, y tú recibes hasta el 50% de esa comisión." },
    ],
    withdrawButton: "Contacta al Propietario",
    withdrawTitle: "Retirar Recompensas",
    chatAdmin: "Chatear con el Propietario",
    telegramNote: "El mismo programa también está disponible en Telegram:",
  },
  "ja-JP": {
    title: "紹介パートナー",
    heroJoin: "PartnerFindの紹介パートナーになろう。",
    heroFree: "無料で参加、2分で始められます。",
    ctaJoin: "今すぐチャット",
    getTitle: "得られるもの",
    getPoint3: "参加は無料。報酬はいつでも、最低額なしで引き出せます",
    feeAsk: "登録料は管理者にお問い合わせください。",
    earnTitle: "収入の仕組み",
    joinTitle: "参加の3ステップ",
    joinStep1: "オーナーに連絡して紹介パートナーとして登録",
    joinStep2: "管理者からガイドを受け取ってください",
    joinStep3: "スタート",
    trustTitle: "実績と信頼",
    inviteOnly: "一般公開ではありません — 招待制です。",
    faqModalQ: "資金や経験は必要ですか？",
    faqModalA: "いいえ。知っている人を招待するだけです — 資金なし、経験なし、販売もありません。",
    faqTimeQ: "どれくらい時間がかかりますか？",
    faqTimeA: "2分で始められます：オーナーにチャットし、招待メッセージを受け取り、時間のあるときに知り合いに共有するだけです。",
    faqSafeQ: "安全ですか？",
    faqSafeA: "はい。登録はPartnerFindの公式リンクから行われ、報酬は第三者ではなくオーナーが直接手動で処理します。",
    step1Title: "オーナーへ連絡",
    step2Title: "知り合いに共有するメッセージ",
    s2Title: "招待をシェアしよう", s2Text: "知り合いに挨拶してチャットし、経済的なチャンスに役立つプラットフォームの招待があることを伝えよう。", s4Title: "支払い方法を聞いて転送しよう", s4Text: "オーナーに支払い方法を聞いて、知り合いに転送しよう。",
    notesTitle: "収入スキーム",
    downloadImage: "画像をダウンロード",
    msgLabel: "メッセージ",
    home: "ホーム",
    intro:
      "招待した人全員から収入を得ましょう。参加は無料、報酬はいつでも引き出せます。",
    howTitle: "仕組み",
    steps: [
      "PartnerFindという名前のチャットグループを作成します。",
      "身近な人を招待します。",
      "下の招待メッセージをグループに送信します。",
      "グループのメンバーにも知り合いへ共有してもらいます。",
      "グループがいっぱいになったら、新しいグループを作成します。",
    ],
    rulesTitle: "ルール",
    rules: [
      "登録料は、登録者本人または招待した紹介パートナーが決めます。",
      "招待した人全員の登録料の50%",
      "招待した人が成約するたびに、プラットフォーム手数料の最大50%",
    ],
    inviteTitle: "招待メッセージ",
    inviteText:
      "PartnerFindは、経済の機会を探している人と、機会を提供する人をつなぎます。\n\n" +
      `ウェブサイトから登録: ${SITE_LINK}`,
    copy: "メッセージをコピー",
    copied: "コピーしました ✓",
    shareLabel: "共有",
    step1Text: "下のボタンからオーナーにチャットして、紹介パートナーを始めましょう。",
    step3Title: "報酬を受け取る",
    step3Text: "招待した人ごとに、下のスキームに従って報酬が入ります。報酬はオーナーへのチャットで引き出せます。",
        simTitle: "シミュレーション例",
    simIntro: "1,000人を招待すると：",
    simLines: [
      { text: "登録料 ¥100 →", amount: "¥50,000" },
      { text: "登録料 ¥1,000 →", amount: "¥500,000" },
    ],
    simNote: "これには、彼らが成立させる合意ごとのプラットフォーム手数料（最大50%）は含まれていません。",
    faqTitle: "FAQ",
    faqs: [
      { q: "紹介パートナーになるのは無料ですか？", a: "はい、無料です。参加に費用はかかりません。" },
      { q: "報酬はいつ引き出せますか？", a: "いつでも、最低額なしで引き出せます。「オーナーに連絡」をタップすると、報酬が手動で処理されます。" },
      { q: "「成約」とはどういう意味ですか？", a: "あなたが招待した機会を探す人と機会を提供する人が合意し、お金を生み出すことです。プラットフォームはそこから手数料を取り、あなたはその手数料の最大50%を受け取ります。" },
    ],
    withdrawButton: "オーナーに連絡",
    withdrawTitle: "報酬の引き出し",
    chatAdmin: "オーナーにチャット",
    telegramNote: "Telegramでも同じプログラムが利用できます:",
  },
  "fr-FR": {
    title: "Partenaire de Parrainage",
    heroJoin: "Devenez Partenaire de Parrainage PartnerFind.",
    heroFree: "Gratuit, démarrez en 2 minutes.",
    ctaJoin: "Discuter maintenant",
    getTitle: "Ce que vous obtenez",
    getPoint3: "Inscription gratuite. Retirez vos récompenses à tout moment, sans minimum",
    feeAsk: "Frais d'inscription : demandez à l'administrateur.",
    earnTitle: "Comment vous gagnez",
    joinTitle: "3 étapes pour rejoindre",
    joinStep1: "Contactez le propriétaire et inscrivez-vous comme Partenaire de Parrainage",
    joinStep2: "Recevez les instructions de l'administrateur",
    joinStep3: "Commencez",
    trustTitle: "Preuve et confiance",
    inviteOnly: "Pas ouvert au public — sur invitation uniquement.",
    faqModalQ: "Faut-il un capital ou de l'expérience ?",
    faqModalA: "Non. Vous invitez simplement des personnes que vous connaissez — sans capital, sans expérience, sans rien vendre.",
    faqTimeQ: "Combien de temps faut-il ?",
    faqTimeA: "Démarrez en 2 minutes : écrivez au propriétaire, recevez le message d'invitation, puis partagez-le à vos connaissances quand vous avez le temps.",
    faqSafeQ: "Est-ce sûr ?",
    faqSafeA: "Oui. L'inscription passe par les liens officiels de PartnerFind et les récompenses sont traitées manuellement et directement par le propriétaire — par aucun tiers.",
    step1Title: "Contacter le Propriétaire",
    step2Title: "Message Partagé aux Personnes que Vous Connaissez",
    s2Title: "Partagez l'Invitation", s2Text: "Saluez et discutez avec des personnes que vous connaissez, puis dites-leur qu'il existe une invitation à une plateforme utile pour les opportunités économiques.", s4Title: "Demandez et Transmettez le Moyen de Paiement", s4Text: "Demandez le moyen de paiement au Propriétaire, puis transmettez-le à la personne que vous connaissez.",
    notesTitle: "Schéma de Revenus",
    downloadImage: "Télécharger l'Image",
    msgLabel: "Message",
    home: "Accueil",
    intro:
      "Gagnez de l’argent pour chaque personne que vous invitez. L’inscription est gratuite et les récompenses peuvent être retirées à tout moment.",
    howTitle: "Comment ça marche",
    steps: [
      "Créez un groupe de discussion nommé PartnerFind.",
      "Invitez vos proches.",
      "Envoyez le message d'invitation ci-dessous à votre groupe.",
      "Demandez aux membres du groupe de le partager à leurs contacts.",
      "Groupe plein ? Créez un nouveau groupe.",
    ],
    rulesTitle: "Règles",
    rules: [
      "Les frais d'inscription sont fixés par la personne inscrite elle-même ou par le Partenaire de Parrainage qui l'invite.",
      "50 % des frais d'inscription de chaque personne que vous invitez",
      "Jusqu'à 50 % de la commission de la plateforme chaque fois qu'une personne que vous avez invitée conclut un accord",
    ],
    inviteTitle: "Message d'Invitation",
    inviteText:
      "PartnerFind relie les personnes en quête d'opportunités économiques à celles qui en proposent.\n\n" +
      `Inscrivez-vous via notre site web : ${SITE_LINK}`,
    copy: "Copier le Message",
    copied: "Copié ✓",
    shareLabel: "Partager",
    step1Text: "Discutez avec le propriétaire via le bouton ci-dessous pour devenir Partenaire de Parrainage.",
    step3Title: "Recevez vos Récompenses",
    step3Text: "Chaque personne que vous invitez vous rapporte des récompenses selon le schéma ci-dessous. Les retraits se font via le chat avec le propriétaire.",
        simTitle: "Exemples de Simulation",
    simIntro: "Invitez 1 000 personnes :",
    simLines: [
      { text: "Frais d'inscription 1 € → vous gagnez", amount: "500 €" },
      { text: "Frais d'inscription 10 € → vous gagnez", amount: "5 000 €" },
    ],
    simNote: "Cela ne comprend pas jusqu'à 50 % de la commission de la plateforme sur chaque accord qu'ils concluent.",
    faqTitle: "FAQ",
    faqs: [
      { q: "Est-ce gratuit de devenir Partenaire de Parrainage ?", a: "Oui, gratuit. Aucun frais pour rejoindre." },
      { q: "Quand puis-je retirer mes récompenses ?", a: "À tout moment, sans minimum. Appuyez sur Contacter le Propriétaire, et vos récompenses seront traitées manuellement." },
      { q: "Que signifie « conclure un accord » ?", a: "Le Chercheur d'Opportunités et le Fournisseur d'Opportunités que vous avez invités parviennent à un accord et génèrent de l'argent. La plateforme en prélève une commission, et vous recevez jusqu'à 50 % de cette commission." },
    ],
    withdrawButton: "Contacter le Propriétaire",
    withdrawTitle: "Retirer les Récompenses",
    chatAdmin: "Discuter avec le Propriétaire",
    telegramNote: "Le même programme est aussi disponible sur Telegram :",
  },
  "ar-SA": {
    title: "شريك الإحالة",
    heroJoin: "كن شريك إحالة في PartnerFind.",
    heroFree: "الانضمام مجاني، وابدأ خلال دقيقتين.",
    ctaJoin: "تحدث الآن",
    getTitle: "ما الذي ستحصل عليه",
    getPoint3: "الانضمام مجاني. اسحب مكافآتك في أي وقت وبدون حد أدنى",
    feeAsk: "رسوم التسجيل — اسأل المسؤول.",
    earnTitle: "كيف تحقق الدخل",
    joinTitle: "3 خطوات للانضمام",
    joinStep1: "تواصل مع المالك وسجّل كشريك إحالة",
    joinStep2: "احصل على الإرشاد من المسؤول",
    joinStep3: "ابدأ",
    trustTitle: "إثبات ومصداقية",
    inviteOnly: "ليس للعامة — بالدعوة فقط.",
    faqModalQ: "هل أحتاج إلى رأس مال أو خبرة؟",
    faqModalA: "لا. ما عليك سوى دعوة أشخاص تعرفهم — بدون رأس مال، بدون خبرة، وبدون بيع.",
    faqTimeQ: "كم من الوقت يستغرق ذلك؟",
    faqTimeA: "ابدأ خلال دقيقتين: راسل المالك، استلم رسالة الدعوة، ثم شاركها مع معارفك متى توفر لديك وقت.",
    faqSafeQ: "هل هذا آمن؟",
    faqSafeA: "نعم. التسجيل عبر روابط PartnerFind الرسمية، والمكافآت يعالجها المالك مباشرة وبشكل يدوي — وليس عبر أي طرف ثالث.",
    step1Title: "اتصل بالمالك",
    step2Title: "الرسالة المشاركة مع الأشخاص الذين تعرفهم",
    s2Title: "شارك الدعوة", s2Text: "رحّب وتحدث مع أشخاص تعرفهم، ثم أخبرهم أن هناك دعوة إلى منصة مفيدة للفرص الاقتصادية.", s4Title: "اطلب وسيلة الدفع ومرّرها", s4Text: "اطلب وسيلة الدفع من المالك، ثم مرّرها إلى الشخص الذي تعرفه.",
    notesTitle: "نظام الدخل",
    downloadImage: "تنزيل الصورة",
    msgLabel: "الرسالة",
    home: "الرئيسية",
    intro:
      "اربح من كل شخص تدعوه. الانضمام مجاني، ويمكن سحب المكافآت في أي وقت.",
    howTitle: "كيفية العمل",
    steps: [
      "أنشئ مجموعة دردشة باسم PartnerFind.",
      "ادعُ الأشخاص المقربين منك.",
      "أرسل رسالة الدعوة أدناه إلى مجموعتك.",
      "اطلب من أعضاء المجموعة مشاركتها مع معارفهم أيضًا.",
      "امتلأت المجموعة؟ أنشئ مجموعة جديدة.",
    ],
    rulesTitle: "القواعد",
    rules: [
      "رسوم التسجيل يحددها المسجِّل نفسه أو شريك الإحالة الذي دعاه.",
      "50% من رسوم تسجيل كل شخص تدعوه",
      "حتى 50% من عمولة المنصة في كل مرة يبرم فيها شخص دعوته صفقة",
    ],
    inviteTitle: "رسالة الدعوة",
    inviteText:
      "يربط PartnerFind الباحثين عن الفرص الاقتصادية بمقدّمي الفرص.\n\n" +
      `سجّل عبر موقعنا الإلكتروني: ${SITE_LINK}`,
    copy: "نسخ الرسالة",
    copied: "تم النسخ ✓",
    shareLabel: "مشاركة",
    step1Text: "راسل المالك عبر الزر أدناه لتبدأ كشريك إحالة.",
    step3Title: "استلم مكافآتك",
    step3Text: "كل شخص تدعوه يمنحك مكافآت وفق النظام أدناه. ويمكن سحب المكافآت عبر مراسلة المالك.",
        simTitle: "أمثلة محاكاة",
    simIntro: "ادعُ 1,000 شخص:",
    simLines: [
      { text: "رسوم التسجيل 1 ريال → تحصل على", amount: "500 ريال" },
      { text: "رسوم التسجيل 10 ريالات → تحصل على", amount: "5,000 ريال" },
    ],
    simNote: "هذا لا يشمل ما يصل إلى 50% من عمولة المنصة عن كل اتفاق يصلون إليه.",
    faqTitle: "FAQ",
    faqs: [
      { q: "هل أن تصبح شريك إحالة مجاني؟", a: "نعم، مجاني. بدون أي رسوم للانضمام." },
      { q: "متى يمكنني سحب مكافآتي؟", a: "في أي وقت، وبدون حد أدنى. اضغط على التواصل مع المالك، وستتم معالجة مكافآتك يدويًا." },
      { q: "ماذا يعني «إبرام صفقة»؟", a: "أن يتوصل الباحث عن الفرص ومقدم الفرص اللذان دعوتهما إلى اتفاق ويحققا المال. تأخذ المنصة عمولة من ذلك، وتحصل أنت على ما يصل إلى 50% من تلك العمولة." },
    ],
    withdrawButton: "التواصل مع المالك",
    withdrawTitle: "سحب المكافآت",
    chatAdmin: "مراسلة المالك",
    telegramNote: "البرنامج نفسه متاح أيضًا على Telegram:",
  },
  "ru-RU": {
    title: "Реферальный партнёр",
    heroJoin: "Станьте реферальным партнёром PartnerFind.",
    heroFree: "Бесплатно, старт за 2 минуты.",
    ctaJoin: "Написать сейчас",
    getTitle: "Что вы получаете",
    getPoint3: "Бесплатное участие. Выводите вознаграждение в любое время, без минимума",
    feeAsk: "Регистрационный взнос — уточняйте у администратора.",
    earnTitle: "Как вы зарабатываете",
    joinTitle: "3 шага для участия",
    joinStep1: "Свяжитесь с владельцем и зарегистрируйтесь как реферальный партнёр",
    joinStep2: "Получите руководство от администратора",
    joinStep3: "Старт",
    trustTitle: "Доказательства и доверие",
    inviteOnly: "Не для всех — только по приглашению.",
    faqModalQ: "Нужны ли капитал или опыт?",
    faqModalA: "Нет. Вы просто приглашаете знакомых — без капитала, без опыта, без продаж.",
    faqTimeQ: "Сколько времени это займёт?",
    faqTimeA: "Старт за 2 минуты: напишите владельцу, получите текст приглашения и делитесь им со знакомыми в удобное время.",
    faqSafeQ: "Это безопасно?",
    faqSafeA: "Да. Регистрация проходит по официальным ссылкам PartnerFind, а вознаграждения владелец обрабатывает вручную и напрямую — без третьих лиц.",
    step1Title: "Связаться с владельцем",
    step2Title: "Сообщение, которым делятся со знакомыми",
    s2Title: "Поделись приглашением", s2Text: "Поздоровайся и напиши знакомым, а затем скажи, что есть приглашение на платформу, полезную для экономических возможностей.", s4Title: "Запроси и передай способ оплаты", s4Text: "Запроси способ оплаты у владельца, а затем передай его человеку, которого ты знаешь.",
    notesTitle: "Схема дохода",
    downloadImage: "Скачать изображение",
    msgLabel: "Сообщение",
    home: "Главная",
    intro:
      "Зарабатывайте на каждом приглашённом. Участие бесплатно, а вознаграждение можно вывести в любое время.",
    howTitle: "Как это работает",
    steps: [
      "Создайте чат-группу с названием PartnerFind.",
      "Пригласите своих близких.",
      "Отправьте сообщение-приглашение ниже в свою группу.",
      "Попросите участников группы поделиться им со своими знакомыми.",
      "Группа заполнена? Создайте новую группу.",
    ],
    rulesTitle: "Правила",
    rules: [
      "Регистрационный взнос определяет сам регистрирующийся или пригласивший его Реферальный партнёр.",
      "50% регистрационного взноса каждого приглашённого вами",
      "До 50% комиссии платформы каждый раз, когда приглашённый вами человек заключает сделку",
    ],
    inviteTitle: "Сообщение-приглашение",
    inviteText:
      "PartnerFind связывает людей, ищущих экономические возможности, с теми, кто эти возможности предоставляет.\n\n" +
      `Зарегистрируйтесь через наш сайт: ${SITE_LINK}`,
    copy: "Копировать сообщение",
    copied: "Скопировано ✓",
    shareLabel: "Поделиться",
    step1Text: "Напишите владельцу через кнопку ниже, чтобы стать реферальным партнёром.",
    step3Title: "Получайте вознаграждения",
    step3Text: "Каждый приглашённый вами человек приносит вам вознаграждения по схеме ниже. Вывести их можно через чат с владельцем.",
        simTitle: "Примеры расчёта",
    simIntro: "Пригласите 1 000 человек:",
    simLines: [
      { text: "Взнос 100 ₽ → вы получите", amount: "50 000 ₽" },
      { text: "Взнос 1 000 ₽ → вы получите", amount: "500 000 ₽" },
    ],
    simNote: "Это не включает до 50% комиссии платформы с каждого достигнутого ими соглашения.",
    faqTitle: "FAQ",
    faqs: [
      { q: "Бесплатно ли стать реферальным партнёром?", a: "Да, бесплатно. Никакой платы за участие." },
      { q: "Когда можно вывести вознаграждение?", a: "В любое время, без минимума. Нажмите «Связаться с владельцем», и ваше вознаграждение будет обработано вручную." },
      { q: "Что значит «заключить сделку»?", a: "Соискатель возможностей и поставщик возможностей, которых вы пригласили, достигают соглашения и зарабатывают деньги. Платформа берёт с этого комиссию, а вы получаете до 50% этой комиссии." },
    ],
    withdrawButton: "Связаться с владельцем",
    withdrawTitle: "Вывод вознаграждений",
    chatAdmin: "Написать владельцу",
    telegramNote: "Та же программа также доступна в Telegram:",
  },
  "ko-KR": {
    title: "추천 파트너",
    heroJoin: "PartnerFind 추천 파트너가 되세요.",
    heroFree: "무료 가입, 2분이면 시작할 수 있습니다.",
    ctaJoin: "지금 채팅하기",
    getTitle: "얻을 수 있는 것",
    getPoint3: "가입은 무료. 보상은 언제든지, 최소 금액 없이 인출할 수 있습니다",
    feeAsk: "등록비는 관리자에게 문의하세요.",
    earnTitle: "수익이 생기는 방식",
    joinTitle: "가입 3단계",
    joinStep1: "운영자에게 연락해 추천 파트너로 등록하세요",
    joinStep2: "관리자의 안내를 받으세요",
    joinStep3: "시작",
    trustTitle: "증거와 신뢰",
    inviteOnly: "일반 공개가 아닙니다 — 초대로만 가능합니다.",
    faqModalQ: "자본이나 경험이 필요한가요?",
    faqModalA: "아니요. 아는 사람을 초대하기만 하면 됩니다 — 자본도, 경험도, 판매도 필요 없습니다.",
    faqTimeQ: "시간이 얼마나 걸리나요?",
    faqTimeA: "2분이면 시작합니다: 운영자에게 채팅하고, 초대 메시지를 받은 뒤, 시간이 날 때 지인에게 공유하세요.",
    faqSafeQ: "안전한가요?",
    faqSafeA: "네. 등록은 PartnerFind 공식 링크로 이뤄지고, 보상은 제3자가 아닌 운영자가 직접 수동으로 처리합니다.",
    step1Title: "소유자에게 문의",
    step2Title: "아는 사람들에게 공유되는 메시지",
    s2Title: "초대를 공유해", s2Text: "아는 사람에게 인사하고 채팅한 뒤, 경제적 기회에 도움이 되는 플랫폼의 초대가 있다고 전해.", s4Title: "결제 수단을 요청하고 전달해", s4Text: "오너에게 결제 수단을 요청한 뒤, 아는 사람에게 전달해.",
    notesTitle: "수익 구조",
    downloadImage: "이미지 다운로드",
    msgLabel: "메시지",
    home: "홈",
    intro:
      "초대하는 모든 사람으로부터 수익을 얻으세요. 가입은 무료이며, 보상은 언제든지 인출할 수 있습니다.",
    howTitle: "이용 방법",
    steps: [
      "PartnerFind라는 이름의 채팅 그룹을 만드세요.",
      "가까운 사람들을 초대하세요.",
      "아래 초대 메시지를 그룹에 보내세요.",
      "그룹 멤버들에게도 지인에게 공유해 달라고 하세요.",
      "그룹이 가득 찼나요? 새 그룹을 만드세요.",
    ],
    rulesTitle: "규칙",
    rules: [
      "등록비는 등록자 본인 또는 초대한 추천 파트너가 정합니다.",
      "초대한 모든 사람의 등록비 50%",
      "초대한 사람이 거래를 성사시킬 때마다 플랫폼 수수료의 최대 50%",
    ],
    inviteTitle: "초대 메시지",
    inviteText:
      "PartnerFind는 경제 기회를 찾는 분들과 기회를 제공하는 분들을 연결해 드립니다.\n\n" +
      `웹사이트에서 가입하세요: ${SITE_LINK}`,
    copy: "메시지 복사",
    copied: "복사됨 ✓",
    shareLabel: "공유",
    step1Text: "아래 버튼으로 소유자에게 문의해 추천 파트너를 시작하세요.",
    step3Title: "보상 받기",
    step3Text: "초대한 사람마다 아래 구조에 따라 보상이 지급됩니다. 보상은 소유자 채팅으로 출금할 수 있습니다.",
        simTitle: "시뮬레이션 예시",
    simIntro: "1,000명을 초대하면:",
    simLines: [
      { text: "등록비 ₩1,000 →", amount: "₩500,000" },
      { text: "등록비 ₩10,000 →", amount: "₩5,000,000" },
    ],
    simNote: "여기에는 그들이 도달하는 계약마다 발생하는 플랫폼 수수료 최대 50%가 포함되지 않았습니다.",
    faqTitle: "FAQ",
    faqs: [
      { q: "추천 파트너가 되는 것은 무료인가요?", a: "네, 무료입니다. 가입 비용이 전혀 없습니다." },
      { q: "보상은 언제 인출할 수 있나요?", a: "언제든지, 최소 금액 없이 인출할 수 있습니다. 소유자에게 연락하기를 누르면 보상이 수동으로 처리됩니다." },
      { q: "“거래 성사”란 무슨 뜻인가요?", a: "초대한 기회 탐색자와 기회 제공자가 합의에 도달해 돈을 버는 것을 뜻합니다. 플랫폼은 거기서 수수료를 가져가고, 여러분은 그 수수료의 최대 50%를 받습니다." },
    ],
    withdrawButton: "소유자에게 연락하기",
    withdrawTitle: "보상 출금",
    chatAdmin: "소유자에게 문의",
    telegramNote: "Telegram에서도 같은 프로그램을 이용할 수 있습니다:",
  },
  "pt-PT": {
    title: "Parceiro de Indicação",
    heroJoin: "Torna-te Parceiro de Referência PartnerFind.",
    heroFree: "Grátis, começa em 2 minutos.",
    ctaJoin: "Conversar agora",
    getTitle: "O que ganhas",
    getPoint3: "Adesão grátis. Levanta as tuas recompensas a qualquer momento, sem mínimo",
    feeAsk: "Taxa de registo — pergunta ao administrador.",
    earnTitle: "Como ganhas",
    joinTitle: "3 passos para aderir",
    joinStep1: "Contacta o proprietário e regista-te como Parceiro de Referência",
    joinStep2: "Recebe as orientações do administrador",
    joinStep3: "Começa",
    trustTitle: "Prova e confiança",
    inviteOnly: "Não é para o público — apenas por convite.",
    faqModalQ: "Preciso de capital ou experiência?",
    faqModalA: "Não. Basta convidares pessoas que conheces — sem capital, sem experiência, sem vender nada.",
    faqTimeQ: "Quanto tempo demora?",
    faqTimeA: "Começa em 2 minutos: fala com o proprietário, recebe a mensagem de convite e partilha-a com os teus conhecidos quando tiveres tempo.",
    faqSafeQ: "É seguro?",
    faqSafeA: "Sim. O registo é feito pelas ligações oficiais da PartnerFind e as recompensas são processadas manualmente e diretamente pelo proprietário — sem terceiros.",
    step1Title: "Contactar o Proprietário",
    step2Title: "Mensagem Partilhada com Pessoas que Conhece",
    s2Title: "Partilha o Convite", s2Text: "Cumprimenta e conversa com pessoas que conheces e depois diz-lhes que há um convite para uma plataforma útil para oportunidades económicas.", s4Title: "Pede e Encaminha o Método de Pagamento", s4Text: "Pede o método de pagamento ao Proprietário e depois encaminha-o para a pessoa que conheces.",
    notesTitle: "Esquema de Rendimentos",
    downloadImage: "Descarregar Imagem",
    msgLabel: "Mensagem",
    home: "Início",
    intro:
      "Ganhe com cada pessoa que convidar. Aderir é grátis e as recompensas podem ser levantadas a qualquer momento.",
    howTitle: "Como Funciona",
    steps: [
      "Crie um grupo de chat chamado PartnerFind.",
      "Convide as pessoas mais próximas de si.",
      "Envie a mensagem de convite abaixo para o seu grupo.",
      "Peça aos membros do grupo que a partilhem com os seus contactos.",
      "Grupo cheio? Crie um novo grupo.",
    ],
    rulesTitle: "Regras",
    rules: [
      "A taxa de inscrição é definida pelo próprio registado ou pelo Parceiro de Indicação que o convida.",
      "50% da taxa de registo de cada pessoa que convidares",
      "Até 50% da comissão da plataforma sempre que uma pessoa que convidaste fecha um negócio",
    ],
    inviteTitle: "Mensagem de Convite",
    inviteText:
      "A PartnerFind conecta quem procura oportunidades económicas com quem oferece oportunidades.\n\n" +
      `Inscreva-se no nosso site: ${SITE_LINK}`,
    copy: "Copiar Mensagem",
    copied: "Copiado ✓",
    shareLabel: "Partilhar",
    step1Text: "Fale com o proprietário pelo botão abaixo para começar como Parceiro de Indicação.",
    step3Title: "Receba as suas Recompensas",
    step3Text: "Cada pessoa que convidar gera-lhe recompensas segundo o esquema abaixo. Os levantamentos fazem-se pelo chat com o proprietário.",
        simTitle: "Exemplos de Simulação",
    simIntro: "Convide 1.000 pessoas:",
    simLines: [
      { text: "Taxa de inscrição 1 € → você ganha", amount: "500 €" },
      { text: "Taxa de inscrição 10 € → você ganha", amount: "5 000 €" },
    ],
    simNote: "Isso não inclui até 50% da comissão da plataforma de cada acordo que eles fecharem.",
    faqTitle: "FAQ",
    faqs: [
      { q: "É grátis tornar-se Parceiro de Referência?", a: "Sim, grátis. Sem qualquer custo para aderir." },
      { q: "Quando posso levantar as minhas recompensas?", a: "A qualquer momento, sem mínimo. Toque em Fale com o Proprietário e as suas recompensas serão processadas manualmente." },
      { q: "O que significa “fechar negócio”?", a: "O Procurador de Oportunidades e o Fornecedor de Oportunidades que convidou chegam a um acordo e geram dinheiro. A plataforma retira uma comissão daí, e você recebe até 50% dessa comissão." },
    ],
    withdrawButton: "Fale com o Proprietário",
    withdrawTitle: "Levantar Recompensas",
    chatAdmin: "Falar com o Proprietário",
    telegramNote: "O mesmo programa também está disponível no Telegram:",
  },
  "zh-CN": {
    title: "推荐伙伴",
    heroJoin: "成为 PartnerFind 推荐伙伴。",
    heroFree: "免费加入，2分钟即可开始。",
    ctaJoin: "立即聊天",
    getTitle: "你能获得什么",
    getPoint3: "免费加入。奖励可随时提取，无最低限额",
    feeAsk: "注册费请咨询管理员。",
    earnTitle: "你如何获得收入",
    joinTitle: "加入的3个步骤",
    joinStep1: "联系负责人，注册成为推荐伙伴",
    joinStep2: "向管理员获取指南",
    joinStep3: "开始",
    trustTitle: "证明与信任",
    inviteOnly: "不对公众开放 — 仅限邀请。",
    faqModalQ: "需要资金或经验吗？",
    faqModalA: "不需要。你只需邀请你认识的人 — 无需资金、无需经验、无需销售。",
    faqTimeQ: "需要多长时间？",
    faqTimeA: "2分钟即可开始：与负责人聊天，接收邀请消息，然后在有空时分享给你认识的人。",
    faqSafeQ: "安全吗？",
    faqSafeA: "安全。注册通过 PartnerFind 官方链接进行，奖励由负责人直接手动处理 — 不经过任何第三方。",
    step1Title: "联系所有者",
    step2Title: "分享给你认识的人的消息",
    s2Title: "分享邀请", s2Text: "向你认识的人打招呼并聊天，然后告诉他们有一个对经济机会有帮助的平台邀请。", s4Title: "索取并转发支付方式", s4Text: "向所有者索取支付方式，然后转发给你认识的人。",
    notesTitle: "收入方案",
    downloadImage: "下载图片",
    msgLabel: "消息",
    home: "首页",
    intro:
      "从你邀请的每一个人身上获得收入。免费加入，奖励可随时提取。",
    howTitle: "如何运作",
    steps: [
      "创建一个名为 PartnerFind 的聊天群组。",
      "邀请你最亲近的人。",
      "将下面的邀请消息发送到你的群组。",
      "请群组成员也分享给他们的熟人。",
      "群组满了？再创建一个新群组。",
    ],
    rulesTitle: "规则",
    rules: [
      "注册费由注册者本人或邀请他的推荐伙伴决定。",
      "你邀请的每个人的注册费的50%",
      "每当你邀请的人成功达成交易，平台佣金的最高50%",
    ],
    inviteTitle: "邀请消息",
    inviteText:
      "PartnerFind 连接寻找经济机会的人与提供机会的人。\n\n" +
      `通过我们的网站注册：${SITE_LINK}`,
    copy: "复制消息",
    copied: "已复制 ✓",
    shareLabel: "分享",
    step1Text: "通过下方按钮联系所有者，开始成为推荐伙伴。",
    step3Title: "领取奖励",
    step3Text: "你邀请的每个人都会按下方方案为你带来奖励。奖励可通过所有者聊天提取。",
        simTitle: "模拟示例",
    simIntro: "邀请 1,000 人：",
    simLines: [
      { text: "注册费 ¥10 → 您可获得", amount: "¥5,000" },
      { text: "注册费 ¥100 → 您可获得", amount: "¥50,000" },
    ],
    simNote: "这还不包括他们达成的每项协议所产生的高达 50% 的平台佣金。",
    faqTitle: "FAQ",
    faqs: [
      { q: "成为推荐伙伴是免费的吗？", a: "是的，免费。加入无需任何费用。" },
      { q: "奖励什么时候可以提取？", a: "随时可以，无最低限额。点击联系所有者，您的奖励将被手动处理。" },
      { q: "“成功达成交易”是什么意思？", a: "您邀请的机会寻找者和机会提供者达成协议并产生收入。平台会从中抽取佣金，您可获得该佣金的最高50%。" },
    ],
    withdrawButton: "联系所有者",
    withdrawTitle: "提取奖励",
    chatAdmin: "联系所有者",
    telegramNote: "Telegram 上也提供同一计划：",
  },
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45">
      {children}
    </h2>
  );
}

export default function Pengundang() {
  const { locale } = useLanguage();
  const s = STRINGS[locale] || STRINGS["id-ID"];
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);
  const [sharedIdx, setSharedIdx] = useState<number | null>(null);
  const shareMsg = async (i: number, mediaIdx: number = i) => {
    const text = (MSG_TEXTS[locale] ?? MSG_TEXTS["en-US"])[i] ?? "";
    const m = MSG_MEDIA[mediaIdx];
    try {
      if (typeof navigator !== "undefined" && "canShare" in navigator && m?.full) {
        const res = await fetch(m.full);
        const blob = await res.blob();
        const file = new File([blob], m.name || "PartnerFind-Pesan.png", { type: blob.type || "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text });
          return;
        }
      }
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ text });
        return;
      }
      throw new Error("share unsupported");
    } catch (err) {
      if ((err as Error)?.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setSharedIdx(i);
      window.setTimeout(() => setSharedIdx(null), 2500);
    }
  };
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground antialiased">
      <header dir="ltr" className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center justify-between px-3 py-3">
          <img src="/logo-partnerfind.webp" alt="PartnerFind" className="h-5 w-auto" />
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/" className="text-sm text-foreground/50 transition-colors hover:text-foreground">
              {s.home}
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-xl px-3 pb-8 pt-6 sm:pb-10">
        {/* ── HERO (layar pertama) ── */}
        <h1 className="mt-2 text-[32px] sm:text-4xl font-black tracking-tight leading-[1.15] text-white">{s.heroJoin}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-foreground/80">{s.intro}</p>
        <a
          href={ADMIN_WA}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[hsl(var(--brand-accent))] px-3.5 text-[15px] font-bold text-white transition-opacity hover:opacity-90"
        >
          {s.withdrawButton}
        </a>

        <section className="mt-9">
          <SectionTitle>{s.getTitle}</SectionTitle>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border/60 bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-accent))]/15 text-[hsl(var(--brand-accent))]">
                  <Percent className="h-[18px] w-[18px]" />
                </span>
                <p className="text-[15px] sm:text-[15.5px] leading-relaxed text-zinc-100">{s.rules[1]}</p>
              </div>
            </div>
            {[
              { Icon: HandCoins, text: s.rules[2] },
            ].map(({ Icon, text }, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/[0.03] px-4 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-accent))]/15 text-[hsl(var(--brand-accent))]">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <p className="text-[15px] sm:text-[15.5px] leading-relaxed text-zinc-100">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <SectionTitle>{s.joinTitle}</SectionTitle>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-border/60 bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-accent))] shadow-[0_4px_12px_hsl(var(--brand-accent)/0.35)]">
                  <span className="text-[15px] font-black leading-none text-white">1</span>
                </span>
                <p className="text-[15.5px] sm:text-[16px] font-bold leading-snug text-white">{s.joinStep1}</p>
              </div>
              <a
                href={ADMIN_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-[hsl(var(--brand-accent))] px-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                {s.withdrawButton}
              </a>
            </div>

            <div className="rounded-xl border border-border/60 bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-accent))] shadow-[0_4px_12px_hsl(var(--brand-accent)/0.35)]">
                  <span className="text-[15px] font-black leading-none text-white">2</span>
                </span>
                <p className="text-[15.5px] sm:text-[16px] font-bold leading-snug text-white">{s.joinStep2}</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-white/[0.03] px-4 py-3.5">
              <div className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--brand-accent))] shadow-[0_4px_12px_hsl(var(--brand-accent)/0.35)]">
                  <span className="text-[15px] font-black leading-none text-white">3</span>
                </span>
                <div className="min-w-0">
                  <p className="text-[15.5px] sm:text-[16px] font-bold leading-snug text-white">{s.step3Title}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-9">
          <SectionTitle>{s.faqTitle}</SectionTitle>
          <div className="mt-4 space-y-5">
            {s.faqs.map((f, i) => (
              <div key={i}>
                <p className="text-[15.5px] sm:text-[16px] font-bold text-white leading-snug">{f.q}</p>
                <p className="mt-1 text-[15px] sm:text-[15.5px] text-zinc-300 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mt-4">
            <a
              href={ADMIN_WA}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[hsl(var(--brand-accent))] px-3.5 text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {s.withdrawButton}
            </a>
          </div>
          <p className="mt-3 text-sm text-foreground/70">
            {s.telegramNote}{" "}
            <a href={BOT_LINK} target="_blank" rel="noreferrer" className="font-medium text-sky-400 underline underline-offset-4 hover:text-sky-300">
              @Partnerfindreal_bot
            </a>
          </p>
        </section>

        <footer className="mt-8 border-t border-border/60 pt-4 text-xs text-foreground/60">
          © 2026 PartnerFind
        </footer>
      </div>
    </div>
  );
}
