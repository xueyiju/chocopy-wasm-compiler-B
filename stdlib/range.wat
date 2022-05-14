(module
  (memory (import "js" "mem") 1)
  (func $alloc (import "libmemory" "alloc") (param i32) (result i32))
  (func $load (import "libmemory" "load") (param i32) (param i32) (result i32))
  (func $store (import "libmemory" "store") (param i32) (param i32) (param i32))
  (func $check_range_error (import "imports" "check_range_error") (param i32) (result i32))
  (func $check_range_index (import "imports" "check_range_index") (param i32)  (param i32) (param i32) (param i32) (result i32))

  (global $heap (mut i32) (i32.const 4))
  ;; Take an amount of blocks (4-byte words) to allocate, return an address
  ;; handle suitable for giving to other access methods
  (func (export "$range$__init__") (param $addr i32) (param $start i32) (param $stop i32) (param $step i32) (result i32)
    
    ;; store the start
    (local.get $addr)
    (i32.const 0)
    (local.get $start)
    (call $store)

    ;; store the stop
    (local.get $addr)
    (i32.const 1)
    (local.get $stop)
    (call $store)

    ;; store the step
    (local.get $addr)
    (i32.const 2)
    (local.get $step)
    (call $check_range_error)
    (call $store)

    ;; update currvalue
    (local.get $addr)
    (i32.const 4)
    (local.get $start)
    (call $store)

    ;; update hasnext value
    (local.get $addr)
    (i32.const 3)

    ;; check to store correct value in hasnext
    ;; get the start field
    (local.get $addr)
    (i32.const 0)
    (call $load)
    
    (local.get $addr)
    (i32.const 2)
    (call $load)
    (i32.mul)
    
    ;; get the stop field
    (local.get $addr)
    (i32.const 1)
    (call $load)
    (local.get $addr)
    (i32.const 2)
    (call $load)
    (i32.mul)

    ;; check if the first value is less than stop
    (i32.lt_s)
    (call $store)

    (local.get $addr))

  (func (export "$range$__hasnext__") (param $addr i32) (result i32)
    ;; get the hasnext field
    (local.get $addr)
    (i32.const 3)
    (call $load))
  
  (func (export "$range$__next__") (param $addr i32) (result i32)
    ;; assuming that next is called only if __hasnext__ returns true
    (local $scratch i32)
    ;; get the next value
    ;; get the currvalue field
    (local.get $addr)
    (i32.const 4)
    (call $load)
    (local.set $scratch)

    ;; leave two instances of the curr value, one for returning, one for getting the next value
    (local.get $scratch)
    (local.get $scratch)

    ;; get the step field
    (local.get $addr)
    (i32.const 2)
    (call $load)

    ;; add them up
    (i32.add)
    (local.set $scratch)

    ;; store the next value in currval
    (local.get $addr)
    (i32.const 4)
    (local.get $scratch)
    (call $store)

    ;; update hasnext
    (local.get $addr)
    (i32.const 3)

    ;; check to store correct value in hasnext
    ;; get the currval field
    (local.get $addr)
    (i32.const 4)
    (call $load)

    (local.get $addr)
    (i32.const 2)
    (call $load)
    (i32.mul)
        
    ;; get the stop field
    (local.get $addr)
    (i32.const 1)
    (call $load)

    (local.get $addr)
    (i32.const 2)
    (call $load)
    (i32.mul)
    ;; check if the next value is less than stop
    (i32.lt_s)
    (call $store))

    (func (export "$range$index") (param $addr i32) (param $val i32)  (result i32)
    (local.get $addr)
    (i32.const 0)
    (call $load)

    (local.get $addr)
    (i32.const 1)
    (call $load)

    (local.get $addr)
    (i32.const 2)
    (call $load)

    (local.get $val)
    (call $check_range_index)

    (local.get $addr)
    (i32.const 0)
    (call $load)

    (i32.sub)

    (local.get $addr)
    (i32.const 2)
    (call $load)
    
    (i32.div_s))
)