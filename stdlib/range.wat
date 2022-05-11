(module
  (memory (import "js" "mem") 1)
  (global $heap (mut i32) (i32.const 4))

  ;; Take an amount of blocks (4-byte words) to allocate, return an address
  ;; handle suitable for giving to other access methods
  (func (export "range$__init__") (param $addr i32) (param $start i32) (param $stop i32) (param $step i32) (result i32)
    ;; store the start
    (local.get $addr)
    (i32.const 0)
    (local.get $start)
    (call $store)

    ;; store the stop
    (local.get $addr)
    (i32.const 4)
    (local.get $stop)
    (call $store)

    ;; store the step
    (local.get $addr)
    (i32.const 4)
    (local.get $step)
    (call $store)

    ;; update currvalue
    (local.get $addr)
    (i32.const 16)
    (local.get $start)
    (call $store)

    ;; update hasnext value
    (local.get $addr)
    (i32.const 16)

    ;; check to store correct value in hasnext
    ;; get the start field
    (local.get $addr)
    (i32.const 0)
    (call $load)
    
    ;; get the stop field
    (local.get $addr)
    (i32.const 4)
    (call $load)

    ;; check if the first value is less than stop
    (i32.lt_s)
    (call $store)

    (local.get $addr))

  (func (export "range$__hasnext__") (param $addr i32) (result i32)
    ;; get the hasnext field
    (local.get $addr)
    (i32.const 12)
    (call $load))
  
  (func (export "range$__next__") (param $addr i32) (result i32)
    ;; assuming that next is called only if __hasnext__ returns true
    (local $scratch i32)
    ;; get the next value
    ;; get the currvalue field
    (local.get $addr)
    (i32.const 12)
    (call $load)
    (local.set $scratch)

    ;; leave two instances of the curr value, one for returning, one for getting the next value
    (local.get $scratch)
    (local.get $scratch)

    ;; get the step field
    (local.get $addr)
    (i32.const 8)
    (call $load)

    ;; add them up
    (i32.add)
    (local.set $scratch)

    ;; store the next value in currval
    (local.get $addr)
    (i32.const 16)
    (local.get $scratch)
    (call $store)

    ;; update hasnext
    (local.get $addr)
    (i32.const 16)

    ;; check to store correct value in hasnext
    ;; get the currval field
    (local.get $addr)
    (i32.const 16)
    (call $load)

    ;; get the step field
    (local.get $addr)
    (i32.const 8)
    (call $load)

    ;; add them up
    (i32.add)
    
    ;; get the stop field
    (local.get $addr)
    (i32.const 4)
    (call $load)

    ;; check if the next value is less than stop
    (i32.lt_s)

    ;; check if the next value is less than stop
    (i32.lt_s)
    (call $store))

  (func (export "range$index") (param $addr i32) (param $num i32) (result i32)
    (local $scratch i32)
    (local.set $scratch (i32.const -1))
    ;; return -1 if not in range
    (block
      ;; basic check if less than stop
      (local.get $num)
      ;; get the stop field
      (local.get $addr)
      (i32.const 4)
      (call $load)
      (i32.lt_s)

      ;; basic check if >= start
      (local.get $num)
      ;; get the start field
      (local.get $addr)
      (i32.const 0)
      (call $load)
      (i32.ge_s)
      
      (i32.and)
      ;; break to outside of the block
      br_if 1

      (local.get $num)
      ;; get the start field
      (local.get $addr)
      (i32.const 0)
      (call $load)
      (i32.sub)

      ;; get the step field
      (local.get $addr)
      (i32.const 8)
      (call $load)
      
      ;; get remainder
      (i32.rem_s)

      ;; check if rem is 0
      (i32.const 0)
      (i32.eq)
      br_if 1

      ;; finally return a valid index
      (local.get $num)
      ;; get the start field
      (local.get $addr)
      (i32.const 0)
      (call $load)
      (i32.sub)

      ;; get the step field
      (local.get $addr)
      (i32.const 8)
      (call $load)
      
      ;; get the index
      (i32.div_s)
      (local.set $scratch)
    )
    (local.get $scratch)
  )
)