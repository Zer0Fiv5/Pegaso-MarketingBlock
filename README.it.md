# Pegaso Marketing Block

Userscript per le pagine UniPegaso e Multiversity che nasconde elementi selezionati dell’interfaccia marketing, chiude popup noti, rimuove il banner cookie e nasconde la sezione **"Per Te"**.

## Cosa fa

Questo userscript aiuta a rendere l’interfaccia più pulita rimuovendo o nascondendo automaticamente alcuni elementi non essenziali della pagina.

Funzionalità principali:

- Chiude popup marketing noti
- Nasconde il banner cookie
- Nasconde la sezione **Per Te** quando contiene lo slider correlato
- Nasconde il blocco promo **Pianificazione esami**
- Pulisce le card upsell nelle schede dei corsi
- Può nascondere il blocco **COMUNICAZIONE IMPORTANTE** in `exam-online`
- Può nascondere il popup **Registrazione dell'ambiente** in `exam-online`
- Esegue nuovamente la pulizia quando la pagina viene aggiornata dinamicamente
- Funziona sia su `*.unipegaso.it` sia su `*.multiversity.click`

## Configurazione

All’inizio di [`pegaso-marketing-block.user.js`](./pegaso-marketing-block.user.js) trovi un blocco `CONFIG` con interruttori `true` / `false` per ogni azione di pulizia.

Toggle disponibili:

- `closeMarketingPopup`: chiude i popup marketing noti
- `hideCookieBanner`: nasconde il banner cookie
- `hidePerTeSection`: nasconde il carosello di raccomandazioni **Per Te**
- `hideExamPlanningSection`: nasconde il blocco promo **Pianificazione esami**
- `disableUpsellCourseBanners`: pulisce le card upsell nelle schede dei corsi
- `hideImportantCommunication`: nasconde il blocco **COMUNICAZIONE IMPORTANTE** in `exam-online` (`false` di default)
- `hideEnvironmentRegistrationPopup`: nasconde il popup **Registrazione dell'ambiente** in `exam-online` (`false` di default)

## Pagine supportate

Lo script viene eseguito su:

```text
https://*.unipegaso.it/*
https://*.multiversity.click/*
```

## Installazione

Per usare questo script, devi avere un gestore di userscript installato nel browser.

Gestori supportati:

* Tampermonkey
* Violentmonkey
* Greasemonkey

### Installa

Installa lo script direttamente da GitHub:

[Installa Pegaso Marketing Block](https://raw.githubusercontent.com/Zer0Fiv5/Pegaso-MarketingBlock/main/pegaso-marketing-block.user.js)

Il tuo gestore di userscript dovrebbe rilevare automaticamente il file `.user.js` e mostrare la schermata di installazione.

Dopo l’installazione, visita una pagina UniPegaso o Multiversity supportata: lo script verrà eseguito automaticamente.

### Aggiornamenti automatici

Lo script supporta gli aggiornamenti automatici tramite il campo metadata `@updateURL`.

Quando viene pubblicata una nuova versione su GitHub, il tuo gestore di userscript può aggiornare automaticamente lo script installato.

## Funzionalità

### Chiusura popup marketing

Lo script rileva i pulsanti di chiusura dei popup noti e li clicca automaticamente quando sono visibili.

### Nascondimento banner cookie

Lo script cerca il link noto alla politica dei cookie e nasconde il contenitore del relativo banner.

### Nascondimento sezione "Per Te"

Lo script cerca intestazioni chiamate **Per Te** e nasconde il blocco di contenuto correlato quando rileva la struttura prevista dello slider.

### Nascondimento blocco "Pianificazione esami"

Lo script nasconde il blocco promo intitolato **Pianificazione esami**, incluso il relativo pulsante di invito all’azione.

### Pulizia card upsell

Lo script rileva le card upsell nelle schede dei corsi e ne pulisce il contenuto interno lasciando visibile il contenitore della card.

### Blocchi exam-online

Lo script può anche nascondere il blocco **COMUNICAZIONE IMPORTANTE** e il popup **Registrazione dell'ambiente** nella pagina `exam-online`. Entrambe le opzioni sono disponibili nel blocco `CONFIG` e sono impostate a `false` di default.

### Pulizia dinamica della pagina

Poiché i siti target possono aggiornare il contenuto dinamicamente, lo script usa un `MutationObserver` e riapplica la pulizia dopo le modifiche al DOM.

## Come funziona

Lo script esegue queste azioni:

1. Inietta una piccola classe CSS di supporto usata per nascondere elementi
2. Cerca pulsanti visibili di chiusura dei popup marketing
3. Nasconde il banner cookie quando viene rilevato
4. Cerca l’intestazione **Per Te**
5. Nasconde la sezione più vicina contenente lo slider
6. Nasconde il blocco promo **Pianificazione esami**
7. Pulisce le card upsell trovate nelle schede dei corsi
8. Nasconde il blocco di comunicazione di exam-online quando abilitato
9. Nasconde il popup di registrazione ambiente di exam-online quando abilitato
10. Osserva i cambiamenti della pagina e ripete la pulizia quando necessario

## Utilizzo

Questo script non richiede comandi manuali.

Una volta installato, viene eseguito automaticamente sulle pagine corrispondenti.

## Note

Questo script è intenzionalmente focalizzato solo sulla pulizia dell’interfaccia.

Non modifica l’avanzamento delle lezioni, i dati dell’account o la logica della piattaforma, oltre alla chiusura o al nascondimento di elementi visivi selezionati.

## Limitazioni

Questo script dipende dalla struttura attuale del sito e dalle classi CSS usate dalla piattaforma.

Potrebbe smettere di funzionare se la piattaforma modifica:

* struttura del DOM
* nomi delle classi
* struttura dei popup
* struttura del banner cookie
* layout dello slider della sezione **Per Te**

In quel caso, i selettori potrebbero dover essere aggiornati.

## Risoluzione problemi

### Lo script sembra non funzionare

Controlla che:

* lo userscript sia abilitato
* tu sia su un dominio supportato
* la pagina sia completamente caricata
* il gestore di userscript non abbia bloccato lo script

### Il popup è ancora visibile

Possibili cause:

* la struttura del popup è cambiata
* il selettore del pulsante di chiusura è cambiato
* il popup viene caricato più tardi del previsto

Ricaricare la pagina può aiutare a verificare se l’observer intercetta correttamente il DOM aggiornato.

### La sezione "Per Te" è ancora visibile

Possibili cause:

* il testo dell’intestazione è cambiato
* la struttura dello slider è cambiata
* la sezione viene renderizzata in modo diverso su quella pagina

### La card upsell è ancora visibile

Possibili cause:

* il testo upsell è cambiato
* la struttura della card è cambiata
* la card usa un nuovo layout non ancora coperto dai selettori

### Il popup o la comunicazione di exam-online è ancora visibile

Possibili cause:

* la struttura della pagina è cambiata
* il blocco usa un titolo o un testo diverso
* il toggle corrispondente nel `CONFIG` è ancora impostato su `false`

## Uso previsto

Questo progetto è pensato come helper lato browser per la pulizia dell’interfaccia, destinato alla personalizzazione della propria esperienza di navigazione.

Usalo responsabilmente e solo dove sei autorizzato a modificare l’esperienza client-side della pagina.

## Disclaimer

Questo progetto non è affiliato, approvato o mantenuto da UniPegaso o Multiversity.

È fornito come userscript indipendente per la personalizzazione personale del browser.

## Contribuire

Issue e pull request sono benvenute.

Contributi utili includono:

* miglioramento dei selettori
* supporto ad altri layout di popup
* miglioramento del rilevamento delle sezioni
* documentazione di cambiamenti nel layout
* miglioramento della compatibilità tra pagine
