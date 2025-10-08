import os
import json
import pandas as pd
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import ast

class ExcelToJsonConverter:
    def __init__(self, root):
        self.root = root
        self.root.title("Excel转JSON工具")
        self.root.geometry("500x250")  # 增加高度以容纳新控件
        
        self.style = ttk.Style()
        self.style.configure('TLabel', font=('Arial', 10))
        self.style.configure('TButton', font=('Arial', 10))
        
        self.create_widgets()
    
    def create_widgets(self):
        title_label = ttk.Label(self.root, text="Excel转JSON转换器", font=('Arial', 14, 'bold'))
        title_label.pack(pady=10)
        
        self.excel_path = tk.StringVar()
        file_frame = ttk.Frame(self.root)
        file_frame.pack(pady=10, padx=20, fill=tk.X)
        
        ttk.Label(file_frame, text="Excel文件:").pack(side=tk.LEFT)
        ttk.Entry(file_frame, textvariable=self.excel_path, width=40).pack(side=tk.LEFT, padx=5)
        ttk.Button(file_frame, text="浏览...", command=self.browse_excel_file).pack(side=tk.LEFT)
        
        # 添加表名作为键的开关
        self.use_sheet_name = tk.BooleanVar(value=True)  # 默认开启
        switch_frame = ttk.Frame(self.root)
        switch_frame.pack(pady=5)
        ttk.Checkbutton(
            switch_frame, 
            text="使用表名作为JSON键", 
            variable=self.use_sheet_name,
            onvalue=True, 
            offvalue=False
        ).pack(side=tk.LEFT)
        
        convert_btn = ttk.Button(self.root, text="转换为JSON", command=self.convert_to_json)
        convert_btn.pack(pady=15)
        
        self.status_label = ttk.Label(self.root, text="", foreground="green")
        self.status_label.pack()
    
    def browse_excel_file(self):
        file_path = filedialog.askopenfilename(
            title="选择Excel文件",
            filetypes=[("Excel文件", "*.xlsx *.xls"), ("所有文件", "*.*")]
        )
        if file_path:
            self.excel_path.set(file_path)
            self.status_label.config(text="")
    
    def convert_to_json(self):
        excel_path = self.excel_path.get()
        
        if not excel_path:
            messagebox.showerror("错误", "请先选择Excel文件")
            return
        
        try:
            excel_file = pd.ExcelFile(excel_path)
            json_data = {}
            
            for sheet_name in excel_file.sheet_names:
                try:
                    # 读取工作表，跳过前3行（保留第4行作为列名，第5行作为类型定义）
                    df = pd.read_excel(excel_path, sheet_name=sheet_name, header=None, skiprows=3)
                    
                    if len(df) < 2:  # 至少需要列名行和类型行
                        continue
                        
                    # 获取列名（第4行）和类型定义（第5行）
                    headers = df.iloc[0].tolist()
                    type_defs = df.iloc[1].tolist()
                    
                    # 实际数据从第6行开始（跳过前5行）
                    data_df = df.iloc[2:].reset_index(drop=True)
                    data_df.columns = headers
                    
                    if len(data_df) == 0:
                        continue
                        
                    # 处理数据
                    sheet_json = self.process_sheet_data(data_df, sheet_name, headers, type_defs)
                    
                    # 根据开关状态决定是否使用表名作为键
                    if self.use_sheet_name.get():
                        json_data.update(sheet_json)
                    else:
                        # 如果不使用表名作为键，直接将内容合并到顶层
                        for key, value in sheet_json[sheet_name].items():
                            json_data[key] = value
                    
                except Exception as e:
                    print(f"处理工作表 '{sheet_name}' 时出错: {str(e)}")
                    continue
            
            if not json_data:
                raise ValueError("没有找到可转换的有效数据")
            
            output_path = os.path.join(
                os.path.dirname(excel_path),
                f"{os.path.splitext(os.path.basename(excel_path))[0]}.json"
            )
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(json_data, f, indent=2, ensure_ascii=False)
            
            success_msg = f"转换成功！文件已保存到:\n{output_path}"
            self.status_label.config(text=success_msg, foreground="green")
            messagebox.showinfo("成功", success_msg)
            
        except Exception as e:
            error_msg = f"转换失败: {str(e)}"
            self.status_label.config(text=error_msg, foreground="red")
            messagebox.showerror("错误", error_msg)
    
    def process_sheet_data(self, df, sheet_name, headers, type_defs):
        """处理单个工作表的数据，根据类型定义转换值"""
        result = {sheet_name: {}}
        
        # 检查是否有id列
        id_col = next((col for col in headers if str(col).lower() == 'id'), None)
        
        for idx, row in df.iterrows():
            item = {}
            for col, type_def in zip(headers, type_defs):
                if pd.isna(col) or pd.isna(type_def):
                    continue
                    
                raw_value = row[col]
                if pd.isna(raw_value):
                    item[col] = None
                    continue
                
                # 根据类型定义转换值
                try:
                    item[col] = self.convert_value(str(raw_value), str(type_def))
                except Exception as e:
                    print(f"转换值 '{raw_value}' 为类型 '{type_def}' 时出错: {str(e)}")
                    item[col] = str(raw_value)  # 转换失败时保留原始字符串
            
            # 使用id列值或行索引作为键
            key = str(row[id_col]) if id_col else str(idx)
            result[sheet_name][key] = item
        
        return result
    
    def convert_value(self, value, type_def):
        """根据类型定义转换单个值，支持数组和二维数组"""
        type_def = str(type_def).strip().lower()
        
        # 处理二维数组类型
        if type_def.endswith("[][]"):
            base_type = type_def[:-4]
            if value.startswith("[") and value.endswith("]"):
                try:
                    # 尝试解析为Python二维列表
                    value_list = ast.literal_eval(value)
                    if not isinstance(value_list, list):
                        value_list = [[value_list]]
                    elif value_list and not isinstance(value_list[0], list):
                        value_list = [value_list]
                    # 递归转换每个元素
                    return [
                        [self._convert_single_value(str(item), base_type) for item in sublist] 
                        for sublist in value_list
                    ]
                except:
                    # 如果解析失败，尝试按特殊格式处理
                    parts = [p.strip() for p in value[1:-1].split(";") if p.strip()]
                    return [
                        [self._convert_single_value(p.strip(), base_type) for p in part.split(",") if p.strip()] 
                        for part in parts
                    ]
            else:
                # 如果不是数组格式，当作单元素二维数组处理
                return [[self._convert_single_value(value, base_type)]]
        
        # 处理一维数组类型
        elif type_def.endswith("[]"):
            base_type = type_def[:-2]
            if value.startswith("[") and value.endswith("]"):
                try:
                    # 尝试解析为Python列表
                    value_list = ast.literal_eval(value)
                    if not isinstance(value_list, list):
                        value_list = [value_list]
                    # 递归转换每个元素
                    return [self._convert_single_value(str(v), base_type) for v in value_list]
                except:
                    # 如果解析失败，按逗号分割
                    parts = [p.strip() for p in value[1:-1].split(",") if p.strip()]
                    return [self._convert_single_value(p, base_type) for p in parts]
            else:
                # 如果不是数组格式，当作单元素数组处理
                return [self._convert_single_value(value, base_type)]
        
        # 处理普通类型
        return self._convert_single_value(value, type_def)
    
    def _convert_single_value(self, value, type_def):
        """转换单个非数组值，确保数值类型正确"""
        type_def = type_def.lower()
        
        if not value:  # 空值处理
            if type_def in ("null", "none"):
                return None
            elif type_def == "string":
                return ""
            elif type_def == "int":
                return 0
            elif type_def == "float":
                return 0.0
            elif type_def == "bool":
                return False
            else:
                return ""
        
        try:
            if type_def == "string":
                return str(value)
            elif type_def == "int":
                # 确保转换为整数，即使输入是浮点数
                return int(float(value)) if str(value).strip() else 0
            elif type_def == "float":
                return float(value) if str(value).strip() else 0.0
            elif type_def == "bool":
                if isinstance(value, str):
                    return value.lower() in ("true", "1", "yes", "y", "t")
                return bool(value)
            elif type_def in ("null", "none"):
                return None
            else:  # 默认当作字符串处理
                return str(value)
        except ValueError:
            print(f"无法将值 '{value}' 转换为类型 '{type_def}'")
            return str(value)  # 转换失败时返回字符串

if __name__ == "__main__":
    root = tk.Tk()
    app = ExcelToJsonConverter(root)
    root.mainloop()