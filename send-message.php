<?php
/**
 * Obsługa formularza kontaktowego — wysyła zgłoszenie e-mailem
 * na adres firmowy przy użyciu wbudowanej funkcji PHP mail().
 *
 * Działa na hostingach współdzielonych z włączoną funkcją mail()
 * (np. cyber_Folks — działa domyślnie, bez dodatkowej konfiguracji).
 */

header('Content-Type: application/json; charset=UTF-8');

// --- Konfiguracja ---
$adresOdbiorcy = 'biuro@fabrykavirali.pl';
$nazwaFirmy    = 'Fabryka Virali';

function odpowiedz(bool $sukces, string $wiadomosc, int $kodHttp = 200): void {
    http_response_code($kodHttp);
    echo json_encode(['success' => $sukces, 'message' => $wiadomosc], JSON_UNESCAPED_UNICODE);
    exit;
}

// Tylko POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    odpowiedz(false, 'Nieprawidłowa metoda żądania.', 405);
}

// Prosta ochrona antyspamowa (honeypot) — pole niewidoczne dla ludzi,
// wypełniane tylko przez boty. Jeśli jest wypełnione, udajemy sukces i kończymy.
if (!empty($_POST['website'])) {
    odpowiedz(true, 'Dziękujemy!');
}

// --- Pobranie i oczyszczenie danych ---
function oczysc(string $wartosc): string {
    // Usuwamy tagi HTML oraz znaki CR/LF (ochrona przed header injection w mail())
    $wartosc = str_replace(["\r", "\n"], ' ', $wartosc);
    return trim(strip_tags($wartosc));
}

$imieNazwisko = isset($_POST['name']) ? oczysc($_POST['name']) : '';
$firma        = isset($_POST['company']) ? oczysc($_POST['company']) : '';
$email        = isset($_POST['email']) ? str_replace(["\r", "\n"], '', trim($_POST['email'])) : '';
$telefon      = isset($_POST['phone']) ? oczysc($_POST['phone']) : '';
$wiadomosc    = isset($_POST['message']) ? oczysc($_POST['message']) : '';
$zgoda        = isset($_POST['consent']) && $_POST['consent'] !== '';

// --- Walidacja ---
$bledy = [];

if ($imieNazwisko === '' || mb_strlen($imieNazwisko) < 2) {
    $bledy[] = 'Podaj imię i nazwisko.';
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $bledy[] = 'Podaj poprawny adres e-mail.';
}
if ($telefon === '' || mb_strlen($telefon) < 6) {
    $bledy[] = 'Podaj poprawny numer telefonu.';
}
if (!$zgoda) {
    $bledy[] = 'Wymagana jest zgoda na przetwarzanie danych osobowych.';
}

if (!empty($bledy)) {
    odpowiedz(false, implode(' ', $bledy), 422);
}

// --- Budowa treści wiadomości ---
$tresc  = "Nowe zgłoszenie z formularza kontaktowego na stronie fabrykavirali.pl\n\n";
$tresc .= "Imię i nazwisko: {$imieNazwisko}\n";
if ($firma !== '') {
    $tresc .= "Firma: {$firma}\n";
}
$tresc .= "E-mail: {$email}\n";
$tresc .= "Telefon: {$telefon}\n";
if ($wiadomosc !== '') {
    $tresc .= "\nWiadomość:\n{$wiadomosc}\n";
}
$tresc .= "\n---\nWysłano: " . date('Y-m-d H:i:s') . "\n";
$tresc .= "IP nadawcy: " . ($_SERVER['REMOTE_ADDR'] ?? 'nieznane') . "\n";

// --- Nagłówki e-maila ---
// Uwaga: w "From" celowo podajemy adres z własnej domeny (nie adres nadawcy z formularza),
// bo wiele serwerów pocztowych odrzuca/oznacza jako spam wiadomości, w których nagłówek
// From podszywa się pod zewnętrzną domenę (weryfikacja SPF/DMARC). Odpowiedź i tak trafi
// bezpośrednio do klienta dzięki nagłówkowi Reply-To.
$naglowki   = "From: {$nazwaFirmy} <formularz@fabrykavirali.pl>\r\n";
$naglowki  .= "Reply-To: {$imieNazwisko} <{$email}>\r\n";
$naglowki  .= "Content-Type: text/plain; charset=UTF-8\r\n";
$naglowki  .= "Content-Transfer-Encoding: 8bit\r\n";

$temat = "Nowe zapytanie ze strony — {$imieNazwisko}";
$temat = '=?UTF-8?B?' . base64_encode($temat) . '?='; // poprawne kodowanie polskich znaków w temacie

// --- Wysyłka ---
$wyslano = @mail($adresOdbiorcy, $temat, $tresc, $naglowki);

if ($wyslano) {
    odpowiedz(true, 'Dziękujemy! Wiadomość została wysłana.');
} else {
    odpowiedz(false, 'Nie udało się wysłać wiadomości. Spróbuj ponownie później lub napisz bezpośrednio na ' . $adresOdbiorcy . '.', 500);
}
