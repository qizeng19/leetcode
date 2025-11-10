```
fn main() {
    println!("=== Rc 和 RefCell 使用场景示例 ===\n");

    // 场景 1: 多个所有者共享数据
    example_rc_shared_ownership();

    // 场景 1.5: 可修改的共享数据（回答 owner1/owner2/owner3 能否修改的问题）
    example_rc_refcell_mutable_shared();

    // 场景 2: RefCell - 内部可变性
    example_refcell_interior_mutability();
}

// ============================================================================
// 场景 1: Rc - 多个所有者共享数据
// ============================================================================
fn example_rc_shared_ownership() {
    println!("【场景 1】Rc - 多个所有者共享数据");

    // 创建一个共享的数据
    let data = Rc::new(42);
    println!("原始数据: {}", data);

    // 多个变量可以共享同一个数据的所有权
    let owner1 = Rc::clone(&data); // 克隆引用，不是克隆数据
    let owner2 = Rc::clone(&data);
    let owner3 = Rc::clone(&data);

    println!("引用计数: {}", Rc::strong_count(&data)); // 输出: 4 (data + owner1 + owner2 + owner3)

    // 所有引用都指向同一个数据
    println!("owner1: {}, owner2: {}, owner3: {}", owner1, owner2, owner3);

    // ========================================================================
    // ❓ 问题：owner1, owner2, owner3 可以修改吗？
    // ========================================================================
    //
    // 答案：当前不可以！因为 Rc<i32> 只提供不可变引用
    //
    // 尝试修改会编译错误：
    // *owner1 = 100;  // ❌ 错误：cannot assign to data in an `Rc`
    //
    // 原因：
    // 1. Rc 设计为只提供不可变引用（共享所有权但不允许修改）
    // 2. 这是 Rust 的安全机制：多个所有者共享数据时，如果允许修改，
    //    可能会导致数据竞争或意外的副作用
    //
    // ========================================================================

    // 当最后一个引用被丢弃时，数据才会被释放
    drop(owner1);
    drop(owner2);
    drop(owner3);
    println!("丢弃3个引用后，引用计数: {}", Rc::strong_count(&data)); // 输出: 1

    println!();
}

// ============================================================================
// 场景 1.5: Rc<RefCell<T>> - 可修改的共享数据
// ============================================================================
fn example_rc_refcell_mutable_shared() {
    println!("【场景 1.5】Rc<RefCell<T>> - 可修改的共享数据");
    println!("（演示如何让 owner1, owner2, owner3 可以修改数据）\n");

    // ========================================================================
    // ✅ 解决方案：使用 Rc<RefCell<T>> 组合
    // ========================================================================
    //
    // Rc<RefCell<i32>> 的含义：
    // - Rc: 允许多个所有者共享数据
    // - RefCell: 允许在运行时进行可变借用（内部可变性）
    // - 组合起来：多个所有者可以共享并修改同一个数据
    //
    // ========================================================================

    // 创建可修改的共享数据
    let data = Rc::new(RefCell::new(42));
    println!("初始值: {}", data.borrow());

    // 多个所有者共享同一个数据
    let owner1 = Rc::clone(&data);
    let owner2 = Rc::clone(&data);
    let owner3 = Rc::clone(&data);

    println!("引用计数: {}", Rc::strong_count(&data)); // 输出: 4

    // ✅ 现在可以通过任何一个 owner 修改数据！
    println!("\n【通过 owner1 修改】");
    *owner1.borrow_mut() = 100;
    println!("owner1 修改后: {}", data.borrow());
    println!("owner2 看到: {}", owner2.borrow());
    println!("owner3 看到: {}", owner3.borrow());
    // 注意：所有 owner 都看到同一个值，因为它们共享同一个数据！

    println!("\n【通过 owner2 修改】");
    *owner2.borrow_mut() = 200;
    println!("owner2 修改后: {}", data.borrow());
    println!("owner1 看到: {}", owner1.borrow());
    println!("owner3 看到: {}", owner3.borrow());

    println!("\n【通过 owner3 修改】");
    *owner3.borrow_mut() = 300;
    println!("owner3 修改后: {}", data.borrow());
    println!("owner1 看到: {}", owner1.borrow());
    println!("owner2 看到: {}", owner2.borrow());

    // ========================================================================
    // 📌 关键理解
    // ========================================================================
    //
    // 1. owner1.borrow_mut() 返回 RefMut<i32>
    // 2. *RefMut<i32> 解引用获取 &mut i32
    // 3. 然后才能进行赋值操作
    //
    // 4. 为什么需要 RefCell？
    //    - Rc 只提供不可变引用
    //    - RefCell 提供"内部可变性"（Interior Mutability）
    //    - 即使 Rc 是不可变的，RefCell 也允许修改内部数据
    //
    // 5. 运行时借用检查：
    //    - 同时只能有一个可变借用或多个不可变借用
    //    - 如果违反规则，程序会在运行时 panic
    //
    // ========================================================================

    drop(owner1);
    drop(owner2);
    drop(owner3);
    println!("\n最终值: {}", data.borrow());
    println!();
}

// ============================================================================
// 场景 2: RefCell - 内部可变性（在不可变引用下修改数据）
// ============================================================================
fn example_refcell_interior_mutability() {
    println!("【场景 2】RefCell - 内部可变性");

    // RefCell 允许在运行时进行借用检查
    let data = RefCell::new(100);

    // ========================================================================
    // 📌 什么是"智能指针包装器"？
    // ========================================================================
    //
    // 1. 普通指针 vs 智能指针
    //    - 普通指针 (&T, &mut T): 直接指向数据，不管理任何资源
    //    - 智能指针: 不仅指向数据，还管理资源的生命周期和行为
    //
    // 2. RefMut 为什么是"包装器"？
    //    - RefMut<i32> 内部实际上包含了一个 &mut i32（实际引用）
    //    - 但它还额外包含了借用检查的信息（比如借用计数）
    //    - 就像一个"盒子"：盒子本身（RefMut） + 盒子里的东西（&mut i32）
    //
    // 3. 为什么需要包装器？
    //    - RefCell 需要在运行时检查借用规则（而不是编译时）
    //    - RefMut 在创建时增加借用计数，在销毁时减少借用计数
    //    - 这样可以防止运行时出现数据竞争（panic）
    //
    // 4. 简化理解：
    //    RefMut<i32> 的内部结构大致如下：
    //    struct RefMut<'a, T> {
    //        value: &'a mut T,        // 实际的引用
    //        borrow: &'a BorrowFlag,  // 借用标志（用于检查）
    //    }
    //
    // 5. Deref/DerefMut trait 的作用：
    //    - 让智能指针可以"假装"成普通指针
    //    - 当你使用 *ref_mut 时，自动调用 deref_mut() 方法
    //    - 这样你就可以像使用普通引用一样使用智能指针
    //
    // ========================================================================

    // 📌 类型说明：
    // data 的类型是 RefCell<i32>
    // data.borrow_mut() 返回 RefMut<i32>，不是 &mut i32
    // RefMut 是一个智能指针，实现了 DerefMut trait
    // 所以需要使用 * 来解引用，获取内部的 &mut i32

    // 不可变借用
    let borrowed = data.borrow();
    println!("不可变借用: {}", borrowed);
    drop(borrowed); // 必须释放不可变借用才能进行可变借用

    // 可变借用
    {
        let mut borrowed_mut = data.borrow_mut();

        // ====================================================================
        // 🔍 智能指针包装器的实际演示
        // ====================================================================
        println!("\n【智能指针包装器演示】");

        // 1. 查看类型
        // borrowed_mut 的类型是 RefMut<i32>，不是 &mut i32
        // RefMut 是一个"盒子"，里面装着实际的 &mut i32

        // 2. 解引用操作
        // *borrowed_mut 会调用 RefMut 的 deref_mut() 方法
        // 返回内部的 &mut i32，然后才能进行赋值
        *borrowed_mut = 200; // 修改数据
        // 等价于：*(borrowed_mut.deref_mut()) = 200

        // 3. 自动解引用（Deref trait）
        // println! 会自动调用 deref()，所以不需要 *
        println!("可变借用后修改为: {}", borrowed_mut);
        // 等价于：println!("{}", *borrowed_mut);
        // 等价于：println!("{}", borrowed_mut.deref());

        // 4. 直接访问内部值（需要解引用）
        let value = *borrowed_mut; // 获取 i32 值
        println!("通过解引用获取的值: {}", value);

        // 5. 智能指针的生命周期管理
        // 当 borrowed_mut 离开作用域时，会自动调用 Drop trait
        // 这会减少 RefCell 的借用计数，释放借用
    } // borrowed_mut 在这里自动释放（调用 Drop，减少借用计数）

    println!("最终值: {}", data.borrow());

    println!();
}

//
```

### 当前代码：`owner1`, `owner2`, `owner3` 不能直接修改

```rust
let data = Rc::new(42);
let owner1 = Rc::clone(&data);
let owner2 = Rc::clone(&data);
let owner3 = Rc::clone(&data);
```

原因：

- `Rc<i32>` 只提供不可变引用
- 尝试修改会编译错误：`cannot assign to data in an Rc`
- 这是 Rust 的安全设计：多个所有者共享数据时不允许直接修改，避免数据竞争

### 解决方案：使用 `Rc<RefCell<T>>` 组合

如果想让 `owner1`, `owner2`, `owner3` 可以修改，使用 `Rc<RefCell<i32>>`：

```rust
let data = Rc::new(RefCell::new(42));
let owner1 = Rc::clone(&data);
let owner2 = Rc::clone(&data);
let owner3 = Rc::clone(&data);

// ✅ 现在可以修改了！
*owner1.borrow_mut() = 100;  // 通过 owner1 修改
*owner2.borrow_mut() = 200;  // 通过 owner2 修改
*owner3.borrow_mut() = 300;  // 通过 owner3 修改
```

### 工作原理

| 类型               | 功能                    | 能否修改 |
| ------------------ | ----------------------- | -------- |
| `Rc<i32>`          | 共享所有权              | ❌ 不能  |
| `Rc<RefCell<i32>>` | 共享所有权 + 内部可变性 | ✅ 可以  |

### 关键点

1. `Rc` 提供共享所有权，但只允许不可变访问
2. `RefCell` 提供内部可变性，允许运行时借用检查
3. 组合使用：`Rc<RefCell<T>>` = 共享 + 可修改

代码中已添加场景 1.5 演示这个功能。运行程序可以看到：

- `owner1` 修改后，`owner2` 和 `owner3` 都能看到新值
- 所有 owner 共享同一个数据，任何一个修改都会影响所有 owner

这就是为什么在树结构中经常使用 `Rc<RefCell<TreeNode>>` 的原因：既需要共享节点，又需要修改节点！
