Fabryka Virali — wersja po audycie responsywności mobile/tablet.

## Poprawki z audytu (2026-07-14)

1. **Formularz kontaktowy** — wysyła wiadomości przez własny skrypt PHP (`send-message.php`), bez zewnętrznych kont/usług. Wymagania:
   - Hosting musi obsługiwać PHP i funkcję `mail()` — **cyber_Folks obsługuje to domyślnie**, bez dodatkowej konfiguracji (limit 5000 e-maili/24h na standardowym pakiecie)
   - Wgraj `send-message.php` do tego samego katalogu co `index.html`
   - Wiadomości trafiają na `biuro@fabrykavirali.pl` (zmień w `send-message.php`, zmienna `$adresOdbiorcy`, jeśli potrzeba innego adresu)
   - Odpowiadanie klientowi: wystarczy kliknąć „Odpowiedz” w mailu — adres klienta jest w nagłówku Reply-To
   - Formularz ma wbudowaną prostą ochronę antyspamową (honeypot) oraz walidację danych po stronie serwera
   - **Uwaga:** jeśli po wgraniu na hosting maile mimo to nie przychodzą, sprawdź w panelu hostingowym, czy funkcja `mail()` nie jest wyłączona (rzadkie, ale się zdarza) — w takim wypadku trzeba przejść na wysyłkę przez SMTP (PHPMailer)
2. Naprawiono literówkę w e-mailu w polityce prywatności (`biuro@ex.comfabrykavirali.pl` → `biuro@fabrykavirali.pl`).
3. Zaktualizowano listę cookies w polityce prywatności — usunięto wpisy o usługach, których strona faktycznie nie używa (reCAPTCHA, YouTube, Calendly, Complianz).
4. Google Fonts i osadzone wideo TikTok ładują się teraz dopiero po zaakceptowaniu cookies (albo po kliknięciu „Załaduj wideo” przy pojedynczym materiale) — zgodnie z opisem w polityce prywatności.
5. Dodano oba numery telefonu do danych structured data (schema.org) oraz ocenę (AggregateRating) na bazie opinii klientów.
6. Skompresowano zdjęcie `IMG_0609.jpg` (3 MB → ok. 97 KB, WebP) i usunięto nieużywane pliki (`contact.jpg`, `IMG_4328...`, `IMG_5096...`).
7. Etykiety w formularzu kontaktowym są teraz poprawnie powiązane z polami (`for`/`id`) dla czytników ekranu.
8. `og:image` zmieniony na pełny adres URL.
9. Animacja przewijania opinii i auto-play respektują teraz `prefers-reduced-motion`.
