# CalculatorFront

Projekt stworzony z pomocą [Visual Studio Code](https://code.visualstudio.com) i [Angular CLI](https://github.com/angular/angular-cli) wersja 15.0.2.

## Zależności projektu

    npm install

## Serwer
Serwer uruchamiany z pomocą

    ng serve

lub (problem ze ścieżkami):

    npm run start

## Obsługiwane ścieżki
- POST /evaluate
: Przesyła wyrażenia matematyczne w postaci string
- GET /history
: Przyjmuje dane w postaci json

## Uruchamianie testów
Testy wykonane z pomocą środowiska [Karma](https://karma-runner.github.io):

    ng test --watch=false --code-coverage

lub (problem ze ścieżkami):

    npm run test -- --watch=false --code-coverage
