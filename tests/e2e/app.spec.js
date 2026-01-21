const { test, expect, _electron: electron } = require('@playwright/test');

test('End-to-end user workflow', async () => {
    // Launch the Electron app
    const electronApp = await electron.launch({ args: ['.'] });
    const window = await electronApp.firstWindow();

    const taskText = 'My new E2E test task';

    // --- Task 1: Add a new todo item ---
    // Điền text vô ô input và nhấn Add
    await window.locator('#todo-input').fill(taskText);
    await window.locator('#add-todo-btn').click();

    // --- Task 2: Verify the todo item was added ---
    // Kiểm tra xem cái list có hiện đúng chữ đó chưa
    const firstTodo = window.locator('.todo-item').first();
    await expect(firstTodo).toContainText(taskText);
    
    // --- Task 3: Mark the todo item as complete ---
    // Tìm cái checkbox trong cái todo đó rồi click
    await firstTodo.locator('input[type="checkbox"]').click();
    // Kiểm tra xem class "completed" có xuất hiện chưa
    await expect(firstTodo).toHaveClass(/completed/);

    // --- Task 4: Delete the todo item ---
    // Tìm nút xóa rồi click
    await firstTodo.locator('.delete-btn').click();
    // Đảm bảo nó biến mất khỏi màn hình
    await expect(firstTodo).toBeHidden();

    // Close the app
    await electronApp.close();
});