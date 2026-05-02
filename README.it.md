# Pegaso Marketing Block

Userscript per le pagine UniPegaso e Multiversity che nasconde elementi selezionati dell’interfaccia marketing, chiude popup noti, rimuove il banner cookie e nasconde la sezione **"Per Te"**.

## Cosa fa

Questo userscript aiuta a rendere l’interfaccia più pulita rimuovendo o nascondendo automaticamente alcuni elementi non essenziali della pagina.

Funzionalità principali:

- Chiude popup marketing noti
- Nasconde il banner cookie
- Nasconde la sezione **Per Te** quando contiene lo slider correlato
- Esegue nuovamente la pulizia quando la pagina viene aggiornata dinamicamente
- Funziona sia su `*.unipegaso.it` sia su `*.multiversity.click`

## Pagine supportate

Lo script viene eseguito su:

```text
https://*.unipegaso.it/*
https://*.multiversity.click/*
````

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

### Pulizia dinamica della pagina

Poiché i siti target possono aggiornare il contenuto dinamicamente, lo script usa un `MutationObserver` e riapplica la pulizia dopo le modifiche al DOM.

## Come funziona

Lo script esegue queste azioni:

1. Inietta una piccola classe CSS di supporto usata per nascondere elementi
2. Cerca pulsanti visibili di chiusura dei popup marketing
3. Nasconde il banner cookie quando viene rilevato
4. Cerca l’intestazione **Per Te**
5. Nasconde la sezione più vicina contenente lo slider
6. Osserva i cambiamenti della pagina e ripete la pulizia quando necessario

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
