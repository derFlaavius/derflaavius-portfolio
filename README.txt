derFlaavius Streamer Portfolio
==============================

Start:
- index.html im Browser öffnen.
- Für die Veröffentlichung den gesamten Ordner auf einen Webspace oder GitHub Pages hochladen.

Struktur:
- index.html
- css/style.css
- js/script.js
- assets/logo-placeholder.svg
- assets/face-placeholder.svg

Bildplatzhalter:
- Ersetze assets/logo-placeholder.svg durch dein finales Logo.
- Ersetze assets/face-placeholder.svg durch dein Porträt beziehungsweise PNG.
- Wenn die Dateinamen gleich bleiben, musst du im HTML nichts ändern.

Kalender:
- Termine stehen gesammelt ganz oben in js/script.js im Array calendarEntries.
- Erlaubte Typen: stream, event und pause.
- date und endDate nutzen das Format YYYY-MM-DD; time ist optional.
- Der sichtbare Hinweis unter dem Kalender erklärt, dass dort hauptsächlich Events angezeigt werden und reguläre Streams über Discord oder Twitch angekündigt werden.

Kanalzahlen:
- js/script.js öffnen.
- Ganz oben im Objekt channelData Follower, durchschnittliche Zuschauer und Affiliate-Jahr anpassen.

Kontaktdaten:
- Geschäftsadresse: business.derflaavius@outlook.de
- Discord: https://discord.gg/Ka4Wmqj2xQ
- Twitch-, Instagram-, Discord-, TwitchTracker- und Impressumslinks stehen direkt in index.html.

Partnerbereich:
- Der Partnerbereich ist Punkt 02 und zeigt aktuell einen freien Werbepartnerplatz.
- Der Kontaktbutton öffnet direkt eine E-Mail an die Geschäftsadresse.

Hinweisblöcke:
- In index.html befinden sich direkt vor dem Kooperationsbereich zwei auskommentierte Vorlagen.
- notice-info erzeugt einen blauen Hinweisblock.
- notice-important erzeugt einen gelben Wichtig-Block.
- Den gewünschten HTML-Block kopieren, an der passenden Stelle einfügen und den Text ersetzen.

Laufband:
- Das Laufband wird durch initSeamlessTicker() in js/script.js automatisch auf die Fensterbreite aufgefüllt und nahtlos dupliziert.

Hinweis:
- Die Seite nutzt Google Fonts. Ohne Internetverbindung werden lokale Systemschriften verwendet.
