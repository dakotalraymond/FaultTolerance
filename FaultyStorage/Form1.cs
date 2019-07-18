using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace FaultyStorage
{
    public partial class Form1 : Form
    {        
        private Thread listener;
        private bool done = false;
        private System.Threading.Timer corruptionTimer;
        private List<string> storedFiles = new List<string>();

        public Form1()
        {
            InitializeComponent();
            string path = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            storagePathBox.Text = path;



            corruptionTimer = new System.Threading.Timer(new TimerCallback(CorruptionEvent));

            int timerRate = (int)corruptionRateInput.Value;
            corruptionTimer.Change(timerRate, timerRate);

        }

        private void CorruptionTimerRateInput_ValueChanged(object sender, EventArgs e)
        {
            int timerRate = (int)corruptionRateInput.Value;
            corruptionTimer.Change(0, timerRate);
        }

        private void CorruptionEvent(object state)
        {
            lock (storedFiles)
            {
                if (storedFiles.Count > 0)
                {                    
                    int corruptionChance = (int)corruptionChanceInput.Value;
                    Random random = new Random();
                    int roll = random.Next() % 101;
                    
                    if (roll < corruptionChance)
                    {
                        int fileIndex = random.Next(0, storedFiles.Count);
                        string fileToCorrupt = storedFiles[fileIndex];
                        OutputText("Corruption event on " + fileToCorrupt);

                        using (FileStream filestream = File.Open(fileToCorrupt, FileMode.Open))
                        {
                            int positionToCorrupt = random.Next(0, (int)new FileInfo(fileToCorrupt).Length);
                            filestream.Position = positionToCorrupt;
                            byte byteToCorrupt = (byte)filestream.ReadByte();

                            byte bitToCorrupt = (byte)(0x01 << (random.Next() % 8));

                            byteToCorrupt ^= bitToCorrupt;

                            filestream.Position = positionToCorrupt;
                            filestream.WriteByte(byteToCorrupt);
                        }
                    }
                }
            }
        }


        private void ListenerThread ()
        {
            OutputText("Started listener thread");
            IPEndPoint remoteEndpoint = new IPEndPoint(IPAddress.Loopback, 1982);
            UdpClient receiveClient = new UdpClient(1982);            
            UdpClient sendClient = new UdpClient();

            OutputText("Listening on port 1982");
            OutputText("Responding on port 1983");

            while (!done)
            {
                byte[] receivedBytes = receiveClient.Receive(ref remoteEndpoint);
                
                switch ((char)receivedBytes[0])
                {
                    case 'r':
                    case 'R':
                        byte[] readResult = HandleRead(receivedBytes);
                        sendClient.Send(readResult, readResult.Length, new IPEndPoint(IPAddress.Loopback, 1983));
                        break;

                    case 'w':
                    case 'W':
                        byte[] writeResult = HandleWrite(receivedBytes);
                        sendClient.Send(writeResult, writeResult.Length, new IPEndPoint(IPAddress.Loopback, 1983));
                        break;

                    case 'q':
                        done = true;
                        break;

                    default:
                        OutputText("Received unknown message");
                        // TODO: Print bytes received
                        break;
                }
            }
        }

        private delegate void StringDelegate(string message);

        private void OutputText(string message)
        {
            if (outputBox.InvokeRequired)
            {
                outputBox.Invoke(new StringDelegate(OutputText), new object[] { message });
            }
            else
            {
                outputBox.AppendText(message + "\r\n");
            }
        }

        private byte[] HandleWrite(byte[] writeMessage)
        {
            OutputText("Handling write message");
            byte success = 0;
            int random = new Random().Next();
            if (random % 101 >= writeFailureRateInput.Value)
            {
                OutputText("Write successful");
                // Parse message
                string filename = Encoding.ASCII.GetString(writeMessage, 1, 32);
                filename = filename.TrimEnd('\0');
                int location = BitConverter.ToInt32(writeMessage, 33);
                byte dataLength = writeMessage[37];
                byte[] data = new byte[dataLength];
                Buffer.BlockCopy(writeMessage, 38, data, 0, dataLength);

                OutputText("Filename: " + filename);
                OutputText("Location: " + location.ToString());
                OutputText("Data: " + BitConverter.ToString(data));

                // do write
                string storagePath = storagePathBox.Text + Path.DirectorySeparatorChar + filename;
                using (Stream fileStream = File.Open(storagePath, FileMode.OpenOrCreate))
                {
                    using (BinaryWriter writer = new BinaryWriter(fileStream))
                    {
                        fileStream.Position = location;
                        writer.Write(data);

                        writer.Close();

                        writer.Dispose();
                    }

                    fileStream.Close();
                    fileStream.Dispose();
                }

                lock (storedFiles)
                {
                    if (!storedFiles.Contains(storagePath))
                    {
                        storedFiles.Add(storagePath);
                    }
                }
                success = 1;
            }
            else
            {
                OutputText("Write failed");
            }

            // Build response
            byte[] response = new byte[writeMessage.Length + 1];
            Buffer.BlockCopy(writeMessage, 0, response, 0, writeMessage.Length);

            response[0] = (byte)'A';
            response[writeMessage.Length] = success;

            return response;
        }

        private byte[] HandleRead(byte[] readMessage)
        {
            OutputText("Handling read message");

            // Parse message
            string filename = Encoding.ASCII.GetString(readMessage, 1, 32);
            filename = filename.TrimEnd('\0');
            int location = BitConverter.ToInt32(readMessage, 33);

            // Build response
            byte[] response = new byte[49];
            Buffer.BlockCopy(readMessage, 0, response, 0, readMessage.Length);

            response[0] = (byte)'D';

            int random = new Random().Next();

            if (random % 101 <= readFailureRateInput.Value)
            {
                response[48] = 0;
                OutputText("Read failed");
            }
            else
            {                
                response[48] = 1;
                // do read
                try
                {
                    string storagePath = storagePathBox.Text + Path.DirectorySeparatorChar + filename;
                    using (FileStream fileStream = File.Open(storagePath, FileMode.Open))
                    {
                        using (BinaryReader reader = new BinaryReader(fileStream))
                        {
                            fileStream.Position = location;

                            long byteCountToRead = 10;

                            if (fileStream.Length - fileStream.Position < 10)
                            {
                                byteCountToRead = fileStream.Length - fileStream.Position;
                            }
                            byte[] data = reader.ReadBytes(10);

                            response[37] = (byte)byteCountToRead;

                            Buffer.BlockCopy(data, 0, response, 38, (int)byteCountToRead);

                            reader.Close();
                            reader.Dispose();
                        }

                        fileStream.Close();
                        fileStream.Dispose();
                    }
                }
                catch(Exception)
                {
                    response[48] = 0;
                }
            }

            OutputText("Read " + (response[48] == 0 ? "failed" : "successful"));
            return response;
        }

        private void Form1_Shown(object sender, EventArgs e)
        {
            listener = new Thread(new ThreadStart(ListenerThread));
            listener.Start();
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            done = true;
            byte[] quit = new byte[1];
            quit[0] = (byte)'q';
            UdpClient quitter = new UdpClient();

            quitter.Send(quit, 1, new IPEndPoint(IPAddress.Loopback, 1982));

            quitter.Dispose();

            corruptionTimer.Dispose();
        }
    }
}
