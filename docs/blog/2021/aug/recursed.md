title: Recursed

## Traversal

![](/blog/static/img/MdDLCp88Pa8.jpg)

## Jar

H - cHest, function call
o - cOntinuation, call/cc
V - Vase (Jar), continuation
K - Key

![](/blog/static/img/7Fa-twY8EU0.jpg)

```rust
fn H1(K):
  call/cc(fn (V) H2(V))
;; same as
;;  call/cc(H2)
  return K

fn H2(V):
  K = V()
  exit(K)

H1(Key())
```
