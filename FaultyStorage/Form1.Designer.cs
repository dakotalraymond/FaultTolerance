namespace FaultyStorage
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.outputBox = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.readFailureRateInput = new System.Windows.Forms.NumericUpDown();
            this.label2 = new System.Windows.Forms.Label();
            this.writeFailureRateInput = new System.Windows.Forms.NumericUpDown();
            this.corruptionRateInput = new System.Windows.Forms.NumericUpDown();
            this.label3 = new System.Windows.Forms.Label();
            this.corruptionChanceInput = new System.Windows.Forms.NumericUpDown();
            this.label4 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.storagePathBox = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.readFailureRateInput)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.writeFailureRateInput)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.corruptionRateInput)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.corruptionChanceInput)).BeginInit();
            this.SuspendLayout();
            // 
            // outputBox
            // 
            this.outputBox.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.outputBox.Location = new System.Drawing.Point(12, 12);
            this.outputBox.Multiline = true;
            this.outputBox.Name = "outputBox";
            this.outputBox.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.outputBox.Size = new System.Drawing.Size(569, 310);
            this.outputBox.TabIndex = 0;
            // 
            // label1
            // 
            this.label1.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(80, 380);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(110, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Read Failure Rate (%)";
            // 
            // readFailureRateInput
            // 
            this.readFailureRateInput.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.readFailureRateInput.Increment = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.readFailureRateInput.Location = new System.Drawing.Point(196, 378);
            this.readFailureRateInput.Name = "readFailureRateInput";
            this.readFailureRateInput.Size = new System.Drawing.Size(40, 20);
            this.readFailureRateInput.TabIndex = 2;
            this.readFailureRateInput.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.readFailureRateInput.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            // 
            // label2
            // 
            this.label2.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(81, 406);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(109, 13);
            this.label2.TabIndex = 3;
            this.label2.Text = "Write Failure Rate (%)";
            // 
            // writeFailureRateInput
            // 
            this.writeFailureRateInput.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.writeFailureRateInput.Increment = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.writeFailureRateInput.Location = new System.Drawing.Point(196, 404);
            this.writeFailureRateInput.Name = "writeFailureRateInput";
            this.writeFailureRateInput.Size = new System.Drawing.Size(40, 20);
            this.writeFailureRateInput.TabIndex = 2;
            this.writeFailureRateInput.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.writeFailureRateInput.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            // 
            // corruptionRateInput
            // 
            this.corruptionRateInput.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.corruptionRateInput.Increment = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.corruptionRateInput.Location = new System.Drawing.Point(433, 378);
            this.corruptionRateInput.Maximum = new decimal(new int[] {
            5000,
            0,
            0,
            0});
            this.corruptionRateInput.Minimum = new decimal(new int[] {
            100,
            0,
            0,
            0});
            this.corruptionRateInput.Name = "corruptionRateInput";
            this.corruptionRateInput.Size = new System.Drawing.Size(49, 20);
            this.corruptionRateInput.TabIndex = 2;
            this.corruptionRateInput.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.corruptionRateInput.Value = new decimal(new int[] {
            2000,
            0,
            0,
            0});
            this.corruptionRateInput.ValueChanged += new System.EventHandler(this.CorruptionTimerRateInput_ValueChanged);
            // 
            // label3
            // 
            this.label3.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(295, 380);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(132, 13);
            this.label3.TabIndex = 4;
            this.label3.Text = "Corruption Timer Rate (ms)";
            // 
            // corruptionChanceInput
            // 
            this.corruptionChanceInput.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.corruptionChanceInput.Increment = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.corruptionChanceInput.Location = new System.Drawing.Point(433, 402);
            this.corruptionChanceInput.Name = "corruptionChanceInput";
            this.corruptionChanceInput.Size = new System.Drawing.Size(49, 20);
            this.corruptionChanceInput.TabIndex = 2;
            this.corruptionChanceInput.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.corruptionChanceInput.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            // 
            // label4
            // 
            this.label4.Anchor = System.Windows.Forms.AnchorStyles.Bottom;
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(315, 404);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(112, 13);
            this.label4.TabIndex = 4;
            this.label4.Text = "Corruption Chance (%)";
            // 
            // label5
            // 
            this.label5.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left)));
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(13, 329);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(69, 13);
            this.label5.TabIndex = 5;
            this.label5.Text = "Storage Path";
            // 
            // storagePathBox
            // 
            this.storagePathBox.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.storagePathBox.Location = new System.Drawing.Point(90, 326);
            this.storagePathBox.Name = "storagePathBox";
            this.storagePathBox.Size = new System.Drawing.Size(491, 20);
            this.storagePathBox.TabIndex = 6;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(593, 450);
            this.Controls.Add(this.storagePathBox);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.corruptionRateInput);
            this.Controls.Add(this.corruptionChanceInput);
            this.Controls.Add(this.writeFailureRateInput);
            this.Controls.Add(this.readFailureRateInput);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.outputBox);
            this.Name = "Form1";
            this.Text = "Faulty Storage";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Form1_FormClosing);
            this.Shown += new System.EventHandler(this.Form1_Shown);
            ((System.ComponentModel.ISupportInitialize)(this.readFailureRateInput)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.writeFailureRateInput)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.corruptionRateInput)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.corruptionChanceInput)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.TextBox outputBox;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.NumericUpDown readFailureRateInput;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.NumericUpDown writeFailureRateInput;
        private System.Windows.Forms.NumericUpDown corruptionRateInput;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.NumericUpDown corruptionChanceInput;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TextBox storagePathBox;
    }
}

