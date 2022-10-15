Projekt polegał na opracowaniu interfejsu w przeglądarce do obsługi struktury drzewa przechowującej ciągi znaków litera po literze. W tym celu wykorzystana została biblioteka umożliwiająca rysowanie wykresów drzewa – GoJS.
Zadanie skupiało się na dwóch głównych aspektach – rysowaniu drzewa oraz przeszukiwaniu go na różne sposoby. W celu tworzenia graficznej reprezentacji drzewa wykorzystane zostały możliwości oferowane przez bibliotekę GoJS. Funkcjonalność związana z przeszukiwaniem drzewa opiera się na strukturze składającej się z obiektów, które przechowują informację o tym, czy są ostatnią literą wyrazu oraz referencje do maksymalnie 26 bezpośrednich dzieci będących takimi samymi obiektami.
Aplikacja umożliwia dodawanie oraz usuwanie wyrazów ze struktury. Wyrazy, które mają wspólne pierwsze litery wykorzystują w drzewie te same ścieżki.

Na drzewie można wykonywać cztery różne operacje przeszukiwania:

• Wyszukanie konkretnego wyrazu – wyraz podświetla się w innym kolorze w wykresie, jeżeli jest w nim zawarty
 
• Wyszukanie wszystkich wyrazów ujętych w drzewie – lista alfabetyczna

• Wyszukanie wszystkich wyrazów rozpoczynających się od pewnego ciągu znaków – lista alfabetyczna
 
• Wyszukiwanie wszystkich wyrazów spełniających warunek (pattern), będący kombinacją liter i symboli '*' (wildcard) – lista alfabetyczna
 
