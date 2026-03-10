
;; BuyMeCoffee Token (BMC)  SIP-010 Fungible Token
;; Maximum supply: 1,000,000 BMC
;; Deployer becomes the owner and receives all STX fee from mints


(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Define the token with max supply of 1,000,000 BMC (6 decimals)
(define-fungible-token bmc-token u1000000000000)   ;; 1_000_000 * 1_000_000 = 1 trillion units

;; Errors
(define-constant ERR-OWNER-ONLY         (err u100))
(define-constant ERR-NOT-TOKEN-OWNER    (err u101))
(define-constant ERR-INVALID-AMOUNT     (err u102))
(define-constant ERR-MAX-SUPPLY-REACHED (err u103))
(define-constant ERR-PAYMENT-FAILED     (err u104))

;; Constants
(define-constant CONTRACT-OWNER tx-sender)   ;; Deployer automatically becomes owner

(define-constant TOKEN-URI      u"https://cautious-gray-cattle.myfilebase.com/ipfs/QmbyAAcgBKZ592P1HCmpidfFuorNx1pEyHdirA8JwA1vu5") ;;
(define-constant TOKEN-NAME     "BuyMeCoffee")
(define-constant TOKEN-SYMBOL   "BMC")
(define-constant TOKEN-DECIMALS u6)

(define-constant MINT-PRICE-PER-UNIT u1)           ;; 
(define-constant MAX-SUPPLY-UNITS    u1000000000000) ;; 


(define-read-only (get-balance (who principal))
  (ok (ft-get-balance bmc-token who)))

(define-read-only (get-total-supply)
  (ok (ft-get-supply bmc-token)))

(define-read-only (get-name)
  (ok TOKEN-NAME))

(define-read-only (get-symbol)
  (ok TOKEN-SYMBOL))

(define-read-only (get-decimals)
  (ok TOKEN-DECIMALS))

(define-read-only (get-token-uri)
  (ok (some TOKEN-URI)))



;; Anyone can mint
(define-public (mint (amount uint) (recipient principal))
  (let
    (
      (cost (* amount MINT-PRICE-PER-UNIT))
      (current-supply (ft-get-supply bmc-token))
      (new-supply (+ current-supply amount))
    )
    (asserts! (> amount u0) ERR-INVALID-AMOUNT)
    (asserts! (<= new-supply MAX-SUPPLY-UNITS) ERR-MAX-SUPPLY-REACHED)

    ;; Pay STX to the contract deployer (owner)
    (try! (stx-transfer? cost tx-sender CONTRACT-OWNER))

    ;; Mint BMC tokens
    (ft-mint? bmc-token amount recipient)
  )
)

;; Standard SIP-010 transfer with optional memo
(define-public (transfer
    (amount uint)
    (sender principal)
    (recipient principal)
    (memo (optional (buff 34))))
  (begin
    (asserts! (or (is-eq tx-sender sender) (is-eq contract-caller sender))
      ERR-NOT-TOKEN-OWNER)

    (try! (ft-transfer? bmc-token amount sender recipient))

    (match memo
      some-memo (print some-memo)
      0x)

    (ok true)
  )
)