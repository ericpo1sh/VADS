#include <set>

#include "websocket.h"

std::set<websocketpp::connection_hdl, std::owner_less<websocketpp::connection_hdl>> connections;

void send_message_to_all(const std::string& message, websocketpp::server<websocketpp::config::asio>* s) {
    for (auto& conn : connections) {
        try {
            s->send(conn, message, websocketpp::frame::opcode::text);
        }
		catch (const websocketpp::exception& e) {
            std::cout << "Failed to send message: " << e.what() << std::endl;
        }
    }
}

void on_message(websocketpp::server<websocketpp::config::asio>* s, websocketpp::connection_hdl hdl, websocketpp::server<websocketpp::config::asio>::message_ptr msg) {
	std::cout << "Received message: " << msg->get_payload() << std::endl;
	for (auto& conn : connections)
		if (conn.lock() != hdl.lock())
			s->send(conn, msg->get_payload(), msg->get_opcode());
}

void on_open(websocketpp::server<websocketpp::config::asio>* s, websocketpp::connection_hdl hdl) {
	connections.insert(hdl);
	std::cout << "Client connected" << std::endl;
}

void on_close(websocketpp::server<websocketpp::config::asio>* s, websocketpp::connection_hdl hdl) {
	connections.erase(hdl);
	std::cout << "Client disconnected" << std::endl;
}
