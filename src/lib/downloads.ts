// Единственный источник ссылок на релизы: главная и футер раньше держали
// две копии и разъезжались по версиям. Обновляем здесь вместе с релизом.
export const LATEST_RELEASE = "2.8.15+260";

// Исходники и сборки лежат в разных репозиториях: код — в meander-public,
// а собранные артефакты — в meanderPUBLIC, который держит только релизы.
// Путь /releases/download/ чувствителен к регистру, так что менять
// meanderPUBLIC на строчный нельзя: ссылки начнут отдавать 404.
export const SOURCE_REPO = "https://github.com/IILLUMINATION/meander-public";
export const RELEASES_REPO = "https://github.com/IILLUMINATION/meanderPUBLIC";
export const LICENSE_NAME = "AGPL-3.0-or-later";
export const LICENSE_URL = "https://www.gnu.org/licenses/agpl-3.0.html";

const release = (version: string, asset: string) =>
  `${RELEASES_REPO}/releases/download/${encodeURIComponent(version)}/${asset}`;

export const DOWNLOAD_LINKS = {
  android: {
    googlePlay:
      "https://play.google.com/store/apps/details?id=com.IILLUMINAT.meadner",
    github: release("2.7.7+208", "Release.Android.apk"),
    apkpure:
      "https://apkpure.com/ru/meander-%D1%82%D0%B5%D0%BA%D1%81%D1%82%D0%BE%D0%B2%D1%8B%D0%B5-%D0%BA%D0%B2%D0%B5%D1%81%D1%82%D1%8B/com.IILLUMINAT.meadner",
    trashbox:
      "https://trashbox.ru/topics/185703/meander-tekstovye-kvesty-1.0.1",
    rustore: "https://www.rustore.ru/catalog/app/com.IILLUMINAT.meadner",
  },
  ios: {
    // Установка на iPhone и iPad идёт только через App Store: .ipa из релизов
    // без Mac и AltStore обычному игроку не поставить.
    appStore: "https://apps.apple.com/app/id6813247027",
  },
  macos: {
    github: release("2.8.14+259", "Release.Macos.zip"),
  },
  linux: {
    github: release(LATEST_RELEASE, "Meander-linux-x64.AppImage"),
  },
  windows: {
    github: release(LATEST_RELEASE, "Release.Windows.zip"),
  },
} as const;