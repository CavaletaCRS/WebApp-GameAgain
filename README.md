# Game Again

Web application sviluppata con **Angular** per la visualizzazione e la vendita di videogiochi usati.

Il progetto nasce come progetto personale con l'obiettivo di approfondire lo sviluppo frontend, la creazione di componenti riutilizzabili, la gestione dell'autenticazione e l'integrazione con servizi cloud.

L'applicazione è pubblicata online tramite **Firebase Hosting**.

## Live Demo

https://game-again-app.web.app/

## Tecnologie

- Angular
- TypeScript
- HTML5
- CSS
- Firebase Authentication
- Firebase / Firestore
- Git / GitHub

## Funzionalità

- Catalogo di videogiochi con dati caricati dinamicamente
- Navigazione per categorie
- Componenti Angular riutilizzabili
- Recupero e gestione dei prodotti tramite Firestore
- Gestione delle immagini tramite URL memorizzati nel database
- Registrazione e autenticazione degli utenti
- Verifica dell'indirizzo email tramite email di conferma
- Recupero e reimpostazione della password
- Carrello personale associato all'utente autenticato
- Persistenza del carrello tramite subcollection Firestore dedicata all'utente
- Layout responsive per desktop e mobile
- Collegamenti esterni per l'acquisto dei prodotti

## Architettura

I prodotti sono memorizzati singolarmente all'interno di una collection Firestore e recuperati dinamicamente dall'applicazione.

Ogni prodotto contiene le informazioni necessarie alla visualizzazione, incluso il riferimento URL alla relativa immagine.

L'autenticazione è gestita tramite **Firebase Authentication**, con registrazione dell'utente, verifica dell'indirizzo email, login e recupero della password.

Per gli utenti autenticati, il carrello viene mantenuto durante l'utilizzo dell'applicazione e sincronizzato con Firestore tramite una subcollection associata all'utente, permettendo di conservarne il contenuto anche tra sessioni differenti.

La logica di accesso ai dati e di autenticazione è organizzata tramite service Angular, mantenendo separata la gestione dei dati dai componenti dell'interfaccia.

## Stato del progetto

Il progetto è attualmente in sviluppo e viene utilizzato anche come ambiente di sperimentazione e approfondimento delle tecnologie utilizzate.

Sono previste nuove funzionalità e ulteriori miglioramenti dell'interfaccia e dell'esperienza utente.

## Autore

**Christian Raul Subelet**  
Software Developer
