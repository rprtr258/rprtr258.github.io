# Exceptions для тех, кому не хватало их в golang

```go
package main

import (
	"errors"
	"fmt"
)

func try(err error) {
	if err != nil {
		panic(err)
	}
}

func try1[T any](t T, err error) T {
	if err != nil {
		panic(err)
	}
	return t
}

func catch(f func()) (err error) {
	defer func() {
		if p := recover(); p != nil {
			if e, ok := p.(error); ok {
				err = e
			} else {
				err = fmt.Errorf("%#v", err)
			}
		}
	}()
	f()
	return nil
}

func fail() (int, error) {
	return 0, errors.New("LOL")
}

func main() {
	fmt.Println(catch(func() {
		fmt.Println(1 + try1(fail()))
	}))
}
```
