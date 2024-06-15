- interactive jq [github.com/ynqa/jnv](https://github.com/ynqa/jnv)
- reference [jqlang.github.io/jq/manual](https://jqlang.github.io/jq/manual/)
- [playground](https://jqplay.rprtr.site/) provided by [github.com/owenthereal/jqplay](https://github.com/owenthereal/jqplay)

```python title="~/.jq"
def group_with(key; value): group_by(key) | map({key: first | key, value: value});
def PI: 1 | atan * 4;
```

## Equivalent transformations
|original|simplified|
|---|---|
|`. \| $f`|`$f`|
|`[.[] \| $f]`|`map($f)`|
|`map($f) \| map($g)`|`map($f \| $g)`|

## Additional definitions
```python
def group_with(key; value):
  group_by(key) | map({key: first|key, value: value});
def group_with(key): group_with(key; .);
```
maps `list` to `map(group $key -> $value(group values))`

## SQL operators/Joins
main [builtins](https://github.com/jqlang/jq/blob/master/src/builtin.jq)
```python
# SQL-ish operators here:
def INDEX(stream; idx_expr):
  reduce stream as $row ({}; .[$row|idx_expr|tostring] = $row);
def INDEX(idx_expr): INDEX(.[]; idx_expr);

def JOIN($idx; idx_expr):
  [.[] | [., $idx[idx_expr]]];
def JOIN($idx; stream; idx_expr):
  stream | [., $idx[idx_expr]];
def JOIN($idx; stream; idx_expr; join_expr):
  stream | [., $idx[idx_expr]] | join_expr;

def IN(s): any(s == .; .);
def IN(src; s): any(src == s; .);
```

some definitions for explanation purposes
- `Row` is any object, e.g. `column -> value`
- `Table as sequence` is `[Row]`
- `Table as map` is `{$id: Row}` where `$id` is function of `Row`, it is `idx_expr` in builtin definitions

`INDEX` converts `Table as a sequence` to `Table as map`: `$table | INDEX(idx_expr)`

To convert `Table as map` back to `Table as sequence` you just need to get all values, which can be done by making stream from object: `$table | .[]`. So `INDEX` allows to index or re-index any tables: seqences and maps.

Also it seems `INDEX($stream, $idx_expr)` can always be replaced with `$stream | INDEX($idx_expr)`, so `INDEX/2` is not needed.

`JOIN` actually is `hash join`, that is joining `Table` (which is sequence or map) with `Index` by `idx_expr` applied to each of the `Table` rows. After that, result is `[$row1, $row2]` and can be mapped using `join_expr`.

`IN` is just checking whether element is present in sequence in SQL fashion:
```python
1 | IN(1, 2, 3)
```
I see no clear purpose in `IN/2`

All in all it seems simpler to have following builtins
```python
# SQL-ish operators here:
def INDEX(idx_expr):
  reduce .[] as $row ({}; .[$row|idx_expr|tostring] = $row);

def JOIN($idx; idx_expr; join_expr):
  map([., $idx[idx_expr]] | join_expr);
def JOIN($idx; idx_expr): JOIN($idx, idx_expr; .);

def IN(s): any(s == .; .);
```

in case join with arbitary predicate is required, `CROSS` may be of help (not builtin). ((`$left` might be changed to input stream))
```python
def CROSS($left; $right; on_expr; join_expr):
  $left
  | map(. as $x | $right | map([$x, .]) | .[])
  | map(select(on_expr) | join_expr);
def CROSS($left; $right; on_expr): CROSS($left; $right; on_expr; .)
def CROSS($left; $right): CROSS($left; $right; true; .);
```
essentially it just make all pairs from `$left` and `$right`, filters with `on_expr` and maps pair of rows with `join_expr`

e.g.
```python
CROSS(.weights; .categories; .[0].name == .[1].name; add)
```