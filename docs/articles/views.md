title: Views

```c
struct BitFields {
    Read bool
    Write bool
    Execute bool
}
===
struct BitFields {
    Read u1
    Write u1
    Execute u1
}
===
typedef BitFields u8
```

```rust
type AOS [n]struct{
    A A
    B B
}
===
type SOA[n int] struct{
    A [n]A
    B [n]B
}
```
