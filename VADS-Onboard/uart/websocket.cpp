#include <set>

#include "websocket.h"

std::set<websocketpp::connection_hdl, std::owner_less<websocketpp::connection_hdl>> connections;

/**
 * websocket_init - initializes websocketpp asio server
 * @server: pointer to websocketpp asio server to be initialized
 * @port: port for server to listen on
 */
void websocket_init(websocketpp::server<websocketpp::config::asio>* server, int port) {
	try {
		server->set_message_handler(bind(&on_message, server, std::placeholders::_1, std::placeholders::_2));
		server->set_open_handler(bind(&on_open, server, std::placeholders::_1));
		server->set_close_handler(bind(&on_close, server, std::placeholders::_1));

		server->init_asio();
		server->listen(port ? port : 7001);
		server->start_accept();
		std::cout << "WebSocket server listening on port " << port << std::endl;
	}
	catch (websocketpp::exception const& e) {
		std::cerr << e.what() << std::endl;
	}
}

/**
 * send_message - sends supplied message to all server connections
 * @message: reference to message to be sent
 * @server: pointer to websocketpp server
 */
void send_message(const std::string& message, websocketpp::server<websocketpp::config::asio>* server) {
	for (auto& conn : connections) {
		try { server->send(conn, message, websocketpp::frame::opcode::text); }
		catch (const websocketpp::exception& e) {
			std::cout << "Failed to send message: " << e.what() << std::endl;
		}
	}
}

/**
 * on_message - message handler for websocketpp server
 * @server: pointer to websocketpp server
 * @hdl: unique identifier of connection where message received
 */
void on_message(websocketpp::server<websocketpp::config::asio>* server, websocketpp::connection_hdl hdl, websocketpp::server<websocketpp::config::asio>::message_ptr msg) {
	std::cout << "Received message: " << msg->get_payload() << std::endl;
	for (auto& conn : connections)
		if (conn.lock() != hdl.lock())
			server->send(conn, msg->get_payload(), msg->get_opcode());
}

/**
 * on_open - connection open handler for websocketpp server
 * @server: pointer to websocketpp server
 * @hdl: unique identifier of connection opened
 */
void on_open(websocketpp::server<websocketpp::config::asio>* server, websocketpp::connection_hdl hdl) {
	connections.insert(hdl);
	std::cout << "Client connected" << std::endl;
}

/**
 * on_close - connection close handler for websocketpp server
 * @server: pointer to websocketpp server
 * @hdl: unique identifier of connection closed
 */
void on_close(websocketpp::server<websocketpp::config::asio>* server, websocketpp::connection_hdl hdl) {
	connections.erase(hdl);
	std::cout << "Client disconnected" << std::endl;
}
