// 窗口配置：置顶、透明、可拖动
// 参考原项目 AppDelegate.swift

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Window};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 获取主窗口
            let main_window = app.get_window("main").unwrap();

            // 设置置顶
            main_window.set_always_on_top(true).unwrap();

            // 设置透明
            main_window.set_decorations(false).unwrap();

            // 定位到右下角
            if let Ok(monitor) = main_window.current_monitor() {
                if let Some(m) = monitor {
                    let size = m.size();
                    let window_size = main_window.outer_size().unwrap();
                    let x = size.width as i32 - window_size.width as i32 - 40;
                    let y = size.height as i32 - window_size.height as i32 - 40;
                    main_window.set_position(tauri::Position::Physical(
                        tauri::PhysicalPosition { x, y }
                    ));
                }
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            set_window_alpha,
            get_window_alpha,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// 设置窗口透明度
#[tauri::command]
fn set_window_alpha(window: Window, alpha: f64) {
    let alpha = alpha as f32;
    window.set_alpha(alpha).unwrap();
}

/// 获取窗口透明度 (默认 0.95)
#[tauri::command]
fn get_window_alpha() -> f64 {
    0.95
}