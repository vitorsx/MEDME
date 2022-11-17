import "./index.scss";
import "../../Common/common.scss";
import Cabecalho from "../../Components/Header/index.js";
import DavidLester from "../../../assets/images/david.svg";
import SendVector from "../../../assets/images/send-message-icon.svg";
import storage from "local-storage";
import { listConversation, getConversationInfoByIdDoctor } from "../../../api/conversationApi.js";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:5000");

export default function Index() {
	const [message, setMessage] = useState("");
	const doctor = storage("doctorInfo");
	const [messages, setMessages] = useState([]);
	const [conversation, setConversation] = useState([]);
	const [conversationId, setConversationId] = useState(-1);
	const [userInfo, setUserInfo] = useState([]);
	const navigate = useNavigate();
	if (!storage("doctorInfo")) {
		navigate("/medic/login")
	}

	async function listDoctorConversation() {
		const r = await listConversation(doctor.id, null);
		setConversation(r);
	}

	async function searchById(id) {
		const r = await getConversationInfoByIdDoctor(id);
		setUserInfo(r);
  }

	async function submitMessage() {
		socket.emit("send_message", {
			conversationId: conversationId,
			type: 2,
			senderId: doctor.id,
			message: message,
		});
		socket.emit("receive_message", {
      conversationId: conversationId,
    });
		setMessage("");
	}

  function messageSide(type) {
		if (type == 2) {
			return "msg-right";
    } else {
      return "msg-left"
    }
  }
	socket.on("receive_message", (data) => {
    setMessages(data);
	});
	document.addEventListener("keypress" , function (e) {
		if(e.key === "Enter"){
			const btn = document.querySelector("#send-doctor");
			btn.click();
		}
	})

	useEffect(() => {
		listDoctorConversation();
  }, []);
	return (
		<main className="messages-main">
			<Cabecalho />
			<div className="messages-content">
				<div className="content">
					<div className="div-conversation">
						{conversation.map((item) => (
							<div
								className="conversation-column"
								onClick={() => {
									setConversationId(item.conversationId);
									searchById(item.conversationId);
									socket.emit("receive_message", {
										conversationId: item.conversationId,
									});
								}}>
								<div className="icon-div">
									
								</div>
								<div className="conversation-info">
								<h1 className="name">{item.userName}</h1>
									<p className="doctor-description">{item.doctorDesc}</p>
								</div>
							</div>
						))}
					</div>
					<div className="div-message">
						<div className="message-header">
							<div className="div-message-header-icon">
								
							</div>
							<div className="div-message-header-name">
							{userInfo.map((item) => (
									<span>{item.userName}</span>
								))}
							</div>
						</div>
						<div className="messages-div">
							{messages &&
								messages.map((item) => {
									return <div className={messageSide(item.senderType)}> <span className="message-text">{item.message}</span> </div>;
								})}
						</div>
						{conversationId != -1 && (
							<div className="div-input-send-message">
								<div className="send-message">
									<div className="div-send-message">
										<input type="text" className="send-message-input" value={message} placeholder="Digite uma mensagem" onChange={(e) => setMessage(e.target.value)} />
										{message && (
											<div id='send-doctor'className="send-icon-div" onClick={() => submitMessage()}>
												<img src={SendVector} alt="send-icon" className="send-icon-vector" />
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
