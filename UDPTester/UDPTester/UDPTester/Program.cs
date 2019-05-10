using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace UDPTester
{
  class Program
  {
    static void Main(string[] args)
    {
      using (UdpClient udpServer = new UdpClient(6001))
      {
        IPEndPoint localpt = new IPEndPoint(IPAddress.Any, 6000);
        udpServer.Connect("127.0.0.1", 6000);

        byte[] buff = File.ReadAllBytes("C:\\Users\\draymond\\Desktop\\testfile.txt");
        byte[] filename = Encoding.ASCII.GetBytes("testfile.txt");
        byte[] fileData = new byte[10];
        UInt32 location = 1;
        byte[] locationBytes = BitConverter.GetBytes(location);
        byte[] message = new byte[47];

        message[0] = (byte) 'D';
        Array.Copy(buff, 0, fileData, 0, buff.Length);
        Array.Copy(fileData, 0, message, 36, 10);
        Array.Copy(filename, 0, message, 1, filename.Length);
        Array.Copy(locationBytes, 0, message, 32, 4);
        message[46] = 1;

        udpServer.Send(message, message.Length);
        Console.ReadKey();

      }


    }
  }
}
