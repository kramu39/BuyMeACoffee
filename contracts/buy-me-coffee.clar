;; BuyMeACoffee - Clarity 4 compatible (current Stacks chain 2026)

(define-constant ERR-NOT-OWNER (err u100))
(define-constant ERR-AMOUNT-TOO-LOW (err u101))
(define-constant MIN-TIP-AMOUNT u1)

(define-constant OWNER tx-sender)
(define-constant CONTRACT tx-sender)

(define-data-var coffee-count uint u0)

(define-map supporter-coffees uint
  {
    sender: principal,
    name: (string-utf8 50),
    message: (string-utf8 140),
    amount: uint,
    block: uint
  }
)

(define-public (tip (amount uint))
  (begin
    (asserts! (>= amount MIN-TIP-AMOUNT) ERR-AMOUNT-TOO-LOW)
    (try! (stx-transfer? amount tx-sender CONTRACT))
    (var-set coffee-count (+ (var-get coffee-count) u1))
    (ok true)
  )
)

(define-public (buy-coffee (name (string-utf8 50)) (message (string-utf8 140)) (amount uint))
  (begin
    (asserts! (>= amount MIN-TIP-AMOUNT) ERR-AMOUNT-TOO-LOW)
    (try! (stx-transfer? amount tx-sender CONTRACT))
    (map-insert supporter-coffees (var-get coffee-count)
      {
        sender: tx-sender,
        name: name,
        message: message,
        amount: amount,
        block: stacks-block-height
      }
    )
    (var-set coffee-count (+ (var-get coffee-count) u1))
    (ok true)
  )
)

(define-public (withdraw)
  (begin
    (asserts! (is-eq tx-sender OWNER) ERR-NOT-OWNER)
    (let ((balance (stx-get-balance CONTRACT)))
      (if (> balance u0)
        (as-contract? (stx-transfer? balance CONTRACT OWNER))
        (ok false)
      )
    )
  )
)

(define-read-only (get-total-coffees) (ok (var-get coffee-count)))
(define-read-only (get-supporter-coffee (id uint)) (map-get? supporter-coffees id))
(define-read-only (has-details (id uint)) (is-some (map-get? supporter-coffees id)))
(define-read-only (get-contract-balance) (ok (stx-get-balance CONTRACT)))