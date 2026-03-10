;; SimpleTip - Low-fee direct tipping contract on Stacks
;; Anyone can tip any principal (friend, creator, etc.) with any amount > 0
;; Emits print events for easy off-chain tracking (no on-chain storage needed)

(define-constant ERR-AMOUNT-TOO-LOW (err u101))
(define-constant MIN-TIP-AMOUNT     u1)   ;; 1 micro-STX minimum (anti-spam)

(define-public (tip (recipient principal) (amount uint))
  (begin
    (asserts! (>= amount MIN-TIP-AMOUNT) ERR-AMOUNT-TOO-LOW)
    
    ;; Direct transfer - cheapest method
    (try! (stx-transfer? amount tx-sender recipient))
    
    ;; Emit event for off-chain apps/indexers (sender = tx-sender)
    (print {
      event: "tip-sent",
      sender: tx-sender,
      recipient: recipient,
      amount: amount,
      memo: u"tip"   ;; optional short fixed memo; can remove if unwanted
    })
    
    (ok true)
  )
)

;; Optional: very cheap read-only function for frontend validation
(define-read-only (get-min-tip-amount)
  (ok MIN-TIP-AMOUNT)
)