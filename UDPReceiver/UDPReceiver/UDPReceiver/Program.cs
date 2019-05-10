using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace UDPReceiver
{
  class Program
  {
    static void Main(string[] args)
    {
      using (UdpClient udpServer2 = new UdpClient(6000))
      {
        IPEndPoint localpt = new IPEndPoint(IPAddress.Any, 6000);
        //udpServer2.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);

        //udpServer2.Client.Bind(localpt);
        Byte[] data = udpServer2.Receive(ref localpt);
        string receivedData = Encoding.ASCII.GetString(data);
        Console.WriteLine(receivedData);
        Console.ReadKey();

      }


    }
  }
}
