using System;
using System.Collections.Generic;
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

        //udpServer.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
        //udpServer.Client.Bind(localpt);
        udpServer.Connect("127.0.0.1", 6000);
        string dataString = "Hello world!";
        Byte[] data = Encoding.ASCII.GetBytes(dataString);
        udpServer.Send(data, data.Length);
        Console.ReadKey();

      }


    }
  }
}
