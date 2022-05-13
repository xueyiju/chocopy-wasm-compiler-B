
(module
  (memory (import "js" "mem") 1)
  (global $heap (mut i32) (i32.const 4))

  ;; Take an amount of blocks (4-byte words) to allocate, return an address
  ;; handle suitable for giving to other access methods
  (func (export "$range$__init__") (param $addr i32) (param $start i32) (param $stop i32) (param $step i32) (result i32)
    ;; store the start
    (local.get $addr)
    (i32.const 0)
    (i32.add)
    (local.get $start)
    (i32.store)

    ;; store the stop
    (local.get $addr)
    (i32.const 4)
    (i32.add)
    (local.get $stop)
    (i32.store)

    ;; store the step
    (local.get $addr)
    (i32.const 8)
    (i32.add)
    (local.get $step)
    (i32.store)

    ;; update currvalue
    (local.get $addr)
    (i32.const 16)
    (i32.add)
    (local.get $start)
    (i32.store)

    ;; update hasnext value
    (local.get $addr)
    (i32.const 12)
    (i32.add)

    ;; check to store correct value in hasnext
    ;; get the start field
    (local.get $addr)
    (i32.const 0)
    (i32.add)
    (i32.load)
    (local.get $addr)
    (i32.const 8)
    (i32.add)
    (i32.load)
    (i32.mul)
    
    ;; get the stop field
    (local.get $addr)
    (i32.const 4)
    (i32.add)
    (i32.load)
    (local.get $addr)
    (i32.const 8)
    (i32.add)
    (i32.load)
    (i32.mul)

    ;; check if the first value is less than stop
    (i32.lt_s)
    (i32.store)

    (local.get $addr))

  (func (export "$range$__hasnext__") (param $addr i32) (result i32)
    ;; get the hasnext field
    (local.get $addr)
    (i32.const 12)
    (i32.add)
    (i32.load))
  
  (func (export "$range$__next__") (param $addr i32) (result i32)
    ;; assuming that next is called only if __hasnext__ returns true
    (local $scratch i32)
    ;; get the next value
    ;; get the currvalue field
    (local.get $addr)
    (i32.const 16)
    (i32.add)
    (i32.load)
    (local.set $scratch)

    ;; leave two instances of the curr value, one for returning, one for getting the next value
    (local.get $scratch)
    (local.get $scratch)

    ;; get the step field
    (local.get $addr)
    (i32.const 8)
    (i32.add)
    (i32.load)

    ;; add them up
    (i32.add)
    (local.set $scratch)

    ;; store the next value in currval
    (local.get $addr)
    (i32.const 16)
    (i32.add)
    (local.get $scratch)
    (i32.store)

    ;; update hasnext
    (local.get $addr)
    (i32.const 12)
    (i32.add)

    ;; check to store correct value in hasnext
    ;; get the currval field
    (local.get $addr)
    (i32.const 16)
    (i32.add)
    (i32.load)

    (local.get $addr)
    (i32.const 8)
    (i32.add)
    (i32.load)
    (i32.mul)
        
    ;; get the stop field
    (local.get $addr)
    (i32.const 4)
    (i32.add)
    (i32.load)

    (local.get $addr)
    (i32.const 8)
    (i32.add)
    (i32.load)
    (i32.mul)
    ;; check if the next value is less than stop
    (i32.lt_s)

    (i32.store))

)