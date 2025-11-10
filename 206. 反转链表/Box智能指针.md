# Box 和 Option 内存布局详解

## 1. Box<T> 的本质

`Box<T>` 是一个**智能指针**，它的本质是：

- 在**堆（heap）**上分配内存来存储 `T` 类型的数据
- 在**栈（stack）**上只存储一个**指针**，指向堆上的数据

### 内存布局示例

```rust
let node = Box::new(ListNode { val: 42, next: None });
```

**栈上的 Box：**

```
栈内存：
┌─────────────┐
│  指针 (8字节) │  ← 指向堆上的 ListNode
└─────────────┘
```

**堆上的实际数据：**

```
堆内存（地址：0x1000）：
┌─────────────┐
│ val: 42     │  ← 4字节
│ next: None  │  ← 8字节（Option 的 None 变体）
└─────────────┘
```

### 为什么 Box 的大小是固定的？

`Box<T>` 本身只包含一个指针，无论 `T` 有多大：

- 在 64 位系统上：指针大小 = **8 字节**
- 在 32 位系统上：指针大小 = **4 字节**

```rust
use std::mem;

// Box<i32> 的大小 = 8 字节（指针）
println!("Box<i32>: {} 字节", mem::size_of::<Box<i32>>());

// Box<[i32; 1000]> 的大小 = 8 字节（还是指针！）
println!("Box<[i32; 1000]>: {} 字节", mem::size_of::<Box<[i32; 1000]>>());
```

无论 `T` 是 4 字节的 `i32` 还是 4000 字节的数组，`Box<T>` 的大小都是 8 字节（64 位系统）。

---

## 2. Option<T> 的内存布局

`Option<T>` 是一个**枚举（enum）**，Rust 使用 **tagged union** 实现：

```rust
enum Option<T> {
    None,    // 没有值
    Some(T), // 有值，值是 T
}
```

### Option 的大小计算

`Option<T>` 的大小取决于 `T` 的大小：

#### 情况 1：T 不能是空指针优化（Niche Optimization）

如果 `T` 本身不能表示"无效值"，`Option<T>` 需要额外的 1 字节来存储 tag（区分 None 和 Some）：

```
Option<T> 的大小 = T 的大小 + 1 字节（tag）+ 对齐填充
```

#### 情况 2：T 可以是空指针优化（Niche Optimization）

如果 `T` 是指针类型（如 `Box<T>`、`&T`、`*mut T` 等），Rust 编译器会进行优化：

- 使用 `null` 指针表示 `None`
- 使用非空指针表示 `Some(T)`
- **不需要额外的 tag 字节！**

```
Option<Box<T>> 的大小 = Box<T> 的大小 = 8 字节
```

---

## 3. Option<Box<ListNode>> 的详细分析

### 内存布局

```rust
pub struct ListNode {
    pub val: i32,                    // 4 字节
    pub next: Option<Box<ListNode>>, // 8 字节（因为空指针优化）
}
```

#### 情况 A：next = None

```
栈上的 ListNode：
┌─────────────┐
│ val: 42     │  ← 4 字节
│ next: None  │  ← 8 字节（null 指针 0x00000000）
└─────────────┘
总大小：12 字节（但会按 8 字节对齐，实际可能是 16 字节）
```

#### 情况 B：next = Some(Box<ListNode>)

```
栈上的 ListNode：
┌─────────────┐
│ val: 42     │  ← 4 字节
│ next: ptr   │  ← 8 字节（指向堆上另一个 ListNode 的指针，如 0x1000）
└─────────────┘

堆上的下一个 ListNode（地址 0x1000）：
┌─────────────┐
│ val: 10     │  ← 4 字节
│ next: None  │  ← 8 字节（null 指针）
└─────────────┘
```

### 为什么 Option<Box<T>> 是 8 字节？

因为**空指针优化（Niche Optimization）**：

1. `Box<T>` 是指针类型，指针值不能是 `null`（Rust 保证）
2. 但 `Option<Box<T>>` 可以利用这一点：
   - `None` → 用 `null` 指针（0x00000000）表示
   - `Some(box)` → 用非空指针表示
3. **不需要额外的 tag 字节**，因为指针本身就能区分 None 和 Some

### 验证代码

```rust
use std::mem;

pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,
}

fn main() {
    // Box<ListNode> 的大小 = 8 字节（指针）
    println!("Box<ListNode>: {} 字节", mem::size_of::<Box<ListNode>>());

    // Option<Box<ListNode>> 的大小 = 8 字节（空指针优化后）
    println!("Option<Box<ListNode>>: {} 字节",
             mem::size_of::<Option<Box<ListNode>>>());

    // ListNode 的大小 = 4 (val) + 8 (next) = 12 字节
    // 但会按 8 字节对齐，实际可能是 16 字节
    println!("ListNode: {} 字节", mem::size_of::<ListNode>());

    // 对比：如果 T 不能空指针优化
    println!("Option<i32>: {} 字节", mem::size_of::<Option<i32>>());
    // 输出：8 字节（4字节 i32 + 1字节 tag + 3字节对齐填充）
}
```

---

## 4. 为什么这样设计？

### 问题：如果不用 Box

```rust
// ❌ 这样写无法编译
pub struct ListNode {
    pub val: i32,
    pub next: Option<ListNode>,  // 错误！
}
```

**编译器错误：**

```
error[E0072]: recursive type `ListNode` has infinite size
```

**原因：**

- `ListNode` 的大小 = `i32` (4 字节) + `Option<ListNode>` 的大小
- `Option<ListNode>` 的大小 = `ListNode` 的大小 + tag
- 形成无限递归，无法计算

### 解决方案：使用 Box

```rust
// ✅ 正确
pub struct ListNode {
    pub val: i32,
    pub next: Option<Box<ListNode>>,  // 8 字节（固定）
}
```

**现在可以计算：**

- `ListNode` 的大小 = `i32` (4 字节) + `Option<Box<ListNode>>` (8 字节) = **12 字节**
- 编译器可以确定大小，编译通过！

---

## 5. 内存对齐（Alignment）

Rust 会对结构体进行内存对齐，通常按最大字段大小的倍数对齐：

```rust
pub struct ListNode {
    pub val: i32,                    // 4 字节，对齐到 4
    pub next: Option<Box<ListNode>>, // 8 字节，对齐到 8
}
```

实际内存布局（考虑对齐）：

```
┌─────────────┬─────────────┐
│ val: i32    │ padding     │  ← 4 字节 + 4 字节填充（对齐到 8）
├─────────────┼─────────────┤
│ next: ptr   │             │  ← 8 字节
└─────────────┴─────────────┘
总大小：16 字节（而不是 12 字节）
```

可以用 `#[repr(packed)]` 取消对齐，但通常不推荐。

---

## 总结

1. **Box<T>** 的大小固定为 8 字节（64 位），因为它只是指针
2. **Option<Box<T>>** 也是 8 字节，因为空指针优化（用 null 表示 None）
3. **ListNode** 的大小 = 4 (val) + 8 (next) = 12 字节，对齐后可能是 16 字节
4. 使用 Box 解决了递归类型的大小问题，让编译器能够确定结构体大小
