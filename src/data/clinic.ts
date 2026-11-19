// Facts for the homepage. Source: veon/client.json (ids in comments). Nothing here is invented:
// no experience years, patient counts, ratings, reviews or opening hours (C-003, C-004, C-005, C-021).

export const clinic = {
  name: "KCC Clinic",
  phone: "+38 (066) 919 99 96", // company.contacts.phones[0], C-015
  tel: "tel:+380669199996",
  address: "м. Ужгород, вул. Минайська, 23А", // company.contacts.addresses[0]
  addressShort: "Минайська, 23А",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=%D0%A3%D0%B6%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%2C+%D0%B2%D1%83%D0%BB.+%D0%9C%D0%B8%D0%BD%D0%B0%D0%B9%D1%81%D1%8C%D0%BA%D0%B0%2C+23%D0%90",
  instagram: "https://www.instagram.com/kcc.klinikastomatologii", // socials[instagram], confirmed
  facebook: "https://www.facebook.com/familyclinic.com.ua", // socials[facebook], C-016
  // Text of the booking block on the client's current site (#contacts form).
  bookingNote: "Наші адміністратори допоможуть підібрати зручний час для візиту.",
} as const;

export type StopId = "child" | "ortho" | "care" | "aesthetic" | "implant";

export interface Price { label: string; value: string; unit: string; }
export interface Stop {
  id: StopId;
  anchor: string;
  name: string;
  /** one exact price position for the hero route (concept 8.2) */
  heroPrice: { label: string; value: string; unit: string };
  prices: Price[];
  fact?: string;
  doctors?: string;
  note?: string;
}

// products_services[0..9], C-006, C-007, C-008, C-020. Order of stops — by the age of the family (concept 3).
export const stops: Stop[] = [
  {
    id: "child",
    anchor: "route-child",
    name: "Дитина",
    heroPrice: { label: "Психологічна адаптація", value: "500", unit: "грн" },
    prices: [
      { label: "Психологічна адаптація дитини", value: "500", unit: "грн" },
      { label: "Лікування початкового карієсу молочного зуба", value: "600", unit: "грн" },
      { label: "Герметизація фісур молочних зубів", value: "700", unit: "грн" },
    ],
    doctors: "Баті Діана та Прокопчук Серафим, терапевти й дитячі стоматологи",
    fact: "Психологічна адаптація дитини — окрема послуга в прайсі клініки.",
  },
  {
    id: "ortho",
    anchor: "route-ortho",
    name: "Брекети й елайнери",
    heroPrice: { label: "Металева брекет-система", value: "8000", unit: "грн" },
    prices: [
      { label: "Металева брекет-система", value: "8000", unit: "грн" },
      { label: "Керамічна брекет-система", value: "22 000", unit: "грн" },
      { label: "Сапфірова брекет-система", value: "25 000", unit: "грн" },
      { label: "Планування елайнерів", value: "3000", unit: "грн" },
    ],
    doctors: "Горзов Арсеній, ортодонт",
  },
  {
    id: "care",
    anchor: "route-care",
    name: "Лікування і гігієна",
    heroPrice: { label: "Професійна гігієна", value: "1950–2400", unit: "грн" },
    prices: [
      { label: "Професійна гігієна Air-Flow Prophy Pearls", value: "1950–2400", unit: "грн" },
      { label: "Лікування карієсу, від початкового до глибокого", value: "2000–2350", unit: "грн" },
    ],
    doctors: "Купрієнко Юлія, терапевт; Цифра Людмила та Маляр Андрій, ендодонтисти",
    fact: "Кореневі канали лікують під мікроскопом.",
  },
  {
    id: "aesthetic",
    anchor: "route-aesthetic",
    name: "Естетика",
    heroPrice: { label: "Відбілювання Beyond, одна щелепа", value: "3700", unit: "грн" },
    prices: [
      { label: "Відбілювання Beyond, одна щелепа", value: "3700", unit: "грн" },
      { label: "Відбілювання Beyond, дві щелепи", value: "7000", unit: "грн" },
      { label: "Реставрація фронтальних зубів Estelite Asteria", value: "2650–3550", unit: "грн" },
    ],
    fact: "Система Beyond Ultra 2: до 8 тонів, сеанс 60 хвилин.",
  },
  {
    id: "implant",
    anchor: "route-implant",
    name: "Імплантація і коронки",
    heroPrice: { label: "Імплант Osstem", value: "450", unit: "у.о." },
    prices: [
      { label: "Імплант Osstem", value: "450", unit: "у.о." },
      { label: "Імплант Straumann", value: "800", unit: "у.о." },
      { label: "All-on-4 на імплантах Osstem", value: "3500", unit: "у.о." },
      { label: "All-on-6 на імплантах Osstem", value: "4500", unit: "у.о." },
      { label: "Цирконієва коронка з керамікою", value: "200", unit: "у.о." },
      { label: "Цирконієва коронка на імпланті Osstem", value: "250", unit: "у.о." },
      { label: "Цирконієва коронка на імпланті Straumann", value: "350", unit: "у.о." },
    ],
    doctors: "Бойчук Микола, хірург-імплантолог; Пецкарь Мирослав, ортопед; Яремчук Софія, хірург і пародонтолог",
    fact: "КТ щелеп роблять у клініці. All-on-4 і All-on-6 завершують цирконієвими коронками на титановій балці.",
    note: "Ціни в у.о. — за курсом банку.",
  },
];

// C-023, verbatim.
export const faq = [
  {
    q: "Чи відновлюєте зуби за допомогою імплантації?",
    a: "Так, KCC Clinic проводить імплантацію зубів в Ужгороді для відновлення одного, кількох або повністю втрачених зубів. Підбираємо оптимальні зубні імпланти індивідуально після консультації та діагностики.",
  },
  {
    q: "Чи приймаєте дітей?",
    a: "Так, наша сімейна стоматологія в Ужгороді надає послуги дитячої стоматології. Лікарі знаходять індивідуальний підхід до маленьких пацієнтів та проводять лікування зубів максимально комфортно, спокійно й без стресу.",
  },
  {
    q: "Чи лікуєте зуби під мікроскопом?",
    a: "Так, у KCC Clinic проводимо лікування зубів під мікроскопом в Ужгороді, зокрема лікування кореневих каналів. Збільшення дозволяє стоматологу краще бачити дрібні деталі та виконувати складні процедури з високою точністю.",
  },
  {
    q: "Чи можна оплатити частинами?",
    a: "Так, у нашій стоматологічній клініці в Ужгороді передбачена можливість оплати лікування зубів частинами. Це дозволяє розподілити вартість стоматологічних послуг на декілька платежів та не відкладати необхідне лікування.",
  },
  {
    q: "Чи встановлюєте коронки?",
    a: "Так, KCC Clinic пропонує встановлення коронок на зуби в Ужгороді для відновлення пошкоджених або значно зруйнованих зубів. Підбираємо форму та відтінок коронки індивідуально, щоб вона виглядала природно та гармонійно поєднувалася із зубним рядом.",
  },
];

export const nav = [
  { href: "#directions", label: "Напрями й ціни" },
  { href: "#cases", label: "Роботи" },
  { href: "#doctors", label: "Лікарі" },
  { href: "#first-visit", label: "Перший візит" },
  { href: "#faq", label: "Питання" },
  { href: "#contacts", label: "Контакти" },
];

export const FUTURE_NOTE = "Розділ у розробці";
export const FORM_NOTE = "Онлайн-заявка з'явиться в повній версії сайту";
