# SoccerVault Backend

Backend dla aplikacji SoccerVault. Aplikacja umożliwia tworzenie lig, dodawanie zawodników i zespołów, generowanie terminarzy spotkań, a także przeglądanie tabeli wyników oraz statystyk zakończonych meczów. Do implementacji wykorzystano technologie stosu MERN: MongoDB jako bazę danych, Node.js oraz Express.js na backendzie, a także React do stworzenia frontend. W celu zapewnienia funkcjonalności, skalowalności i stabilności aplikacji, oparto ją na wzorcu Model-View-Controller (MVC).

## Technologie

* **Język:** Node.js
* **Framework:** Express
* **Baza Danych:** MongoDB
* **ODM:** Mongoose
* **Zarządzanie zależnościami:** npm
* **Autentykacja/Autoryzacja:** OAuth

## Instalacja i Konfiguracja

1.  **Sklonuj repozytorium:**
    ```bash
    git clone https://github.com/Litas0/SoccerVaultBackend.git
    ```
2.  **Przejdź do katalogu projektu:**
    ```bash
    cd SoccerVaultBackend
    ```
3.  **Zainstaluj zależności:**
    ```bash
    npm install
## Uruchomienie

* **Tryb deweloperski (z automatycznym przeładowaniem):**
    ```bash
    npm run dev
* **Tryb produkcyjny:**
    ```bash
    npm start
    ```
