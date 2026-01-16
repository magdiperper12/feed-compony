'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MdSend, MdAttachFile, MdInsertEmoticon } from 'react-icons/md';
import { IoIosArrowDown } from 'react-icons/io';
import EmojiPicker from 'emoji-picker-react';
import { FaSmile, FaRobot } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';
import { TypeAnimation } from 'react-type-animation';
import Question from './Question';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { div } from 'framer-motion/client';

const AImessage: React.FC = () => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [inputValue, setInputValue] = useState('');
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [messages, setMessages] = useState<
		{ text: string; type: string; time: string }[]
	>([]);
	const [isTyping, setIsTyping] = useState(false);
	const chatEndRef = useRef<HTMLDivElement | null>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
	const [time, setTime] = useState('');

	const handleToggle = () => {
		const audio = new Audio('/audio/Select.mp3');
		audio.play();
		setIsVisible(!isVisible);
	};

	const handleFileClick = () => fileInputRef.current?.click();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setInputValue((prev) => `${prev} ${file.name}`);
	};

	const handleSendMessage = () => {
		if (inputValue.trim()) {
			const currentTime = new Date().toLocaleTimeString([], {
				hour: '2-digit',
				minute: '2-digit',
			});
			const newUserMessage = {
				text: inputValue,
				type: 'user',
				time: currentTime,
			};
			setMessages((prev) => [...prev, newUserMessage]);
			setInputValue('');
			setIsTyping(true);
			setTimeout(() => {
				const botReply =
					'This is an automatic response. How can I assist you further?';
				const audio = new Audio('/audio/open-chat.mp3');
				audio.play();
				setIsTyping(false);
				setMessages((prev) => [
					...prev,
					{ text: botReply, type: 'bot', time: currentTime },
				]);
			}, 1500);
		}
	};

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, isTyping]);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleEmojiClick = (emoji: { emoji: string }) => {
		setInputValue((prev) => prev + emoji.emoji);
		setShowEmojiPicker(false);
	};

	const toggleEmojiPicker = () =>
		setTimeout(() => setShowEmojiPicker((prev) => !prev), 100);

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSendMessage();
	};

	const handleQuestionClick = (question: string) => {
		setSelectedQuestion(question);
		const currentTime = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		});
		const audio = new Audio('/audio/open-chat.mp3');
		audio.play();

		// إضافة رسالة المستخدم
		const userMsg = { text: question, type: 'user', time: currentTime };
		setMessages((prev) => [...prev, userMsg]);
		setTime(currentTime);
		setIsTyping(true);

		// إضافة رد البوت بعد فترة قصيرة
		setTimeout(() => {
			const botReply =
				Question.find((item) => item.question === question)?.answer || '';
			const botMsg = { text: botReply, type: 'bot', time: currentTime };
			const audio = new Audio('/audio/open-chat.mp3');
			audio.play();
			setIsTyping(false);
			setMessages((prev) => [...prev, botMsg]);
		}, 2000);
	};

	const renderQuestionButtons = () => {
		const [showQuestions, setShowQuestions] = useState(false);
		return (
			<div className='m-auto text-center w-full'>
				<button
					onClick={() => setShowQuestions(!showQuestions)}
					className='mb-4 p-2 border-green-500 border-2 text-green-600 rounded-xl hover:bg-green-500 hover:text-white transition-all'>
					{showQuestions ? 'إخفاء' : 'اسالني'}
				</button>
				<div className='m-auto '>
					{showQuestions && (
						<div className='flex  flex-col gap-2'>
							{Question.map((item, index) => (
								<button
									key={index}
									onClick={() => handleQuestionClick(item.question)}
									aria-label='إعدادات'
									className='border-2 border-green-500 p-2 w-10/12 md:w-3/4 m-auto hover:bg-green-50 rounded-lg hover:text-black transition-all duration-150 hover:border-green-500'>
									{item.question}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<div className=''>
			<div className='group relative m-2 flex justify-center items-center'>
				<div
					className={`bg-gray-100 text-white border-2 border-green-300 rounded-full h-14 w-14 md:h-16 md:w-16 cursor-pointer  shadow-green-300 dark:shadow-green-600 flex justify-center items-center z-50 transition-transform duration-300 ease-in-out ${
						isVisible ? 'opacity-0' : 'opacity-100'
					}`}
					onClick={handleToggle}>
					<Image
						src='/images/logo-removebg.png'
						width={64}
						height={38}
						alt='شركة كودا - تطوير البرمجيات والذكاء الاصطناعي'
						className='h-10 w-10 md:h-12 md:w-12'
					/>
				</div>
			</div>

			{/* Chat Box */}
			<div
				className={`z-50 bg-white transition-transform  duration-500 ease-in-out w-11/12 md:w-96 shadow-custom shadow-green-200 rounded-2xl fixed ${
					isVisible
						? 'bottom-10 end-4 md:bottom-20 md:end-8 lg:bottom-24 lg:end-10 xl:bottom-16 translate-y-0 opacity-100'
						: 'bottom-8 md:end-8 md:bottom-12 translate-y-full opacity-0 pointer-events-none'
				}`}>
				{/* Header */}
				<div className='bg-green-500 text-white px-7 py-7 md:py-5  flex justify-between items-center rounded-t-2xl'>
					<div className='flex items-center'>
						<Image
							src='/images/logo-removebg.png'
							width={64}
							height={38}
							alt='شركة كودا - تطوير البرمجيات والذكاء الاصطناعي'
							className='h-10 w-16 md:h-14 md:w-20 mr-1'
						/>
					</div>
					<button
						onClick={handleToggle}
						aria-label='إعدادات'
						className='hover:text-green-600 text-green-100'>
						<IoIosArrowDown className='h-10 w-10 md:h-10 transition-transform duration-300 ease-in-out hover:scale-110' />
					</button>
				</div>

				{/* Chat Content */}
				<div className='pb-4 space-y-4 h-[55vh]  md:h-96 overflow-auto custom-scrollbar bg-white transition-all duration-300 ease-in-out  '>
					{/* Header with robot */}
					<div className='relative  bg-green-400 text-white text-center px-7 pt-1 pb-8 text-xl overflow-hidden'>
						<div className='flex flex-row gap-2 justify-center items-center text-green-50 text-lg'>
							UFP هنا لمساعدتك
							<FaRobot className='h-10 w-10 inline mb-1' />
						</div>
						<div className='absolute inset-x-0 bottom-0 h-16'>
							<svg
								className='w-full h-full'
								viewBox='0 0 1440 320'
								preserveAspectRatio='none'>
								<path
									fill='white'
									d='M0,160L40,176C80,192,160,224,240,218.7C320,213,400,171,480,170.7C560,171,640,213,720,213.3C800,213,880,171,960,160C1040,149,1120,171,1200,186.7C1280,203,1360,213,1400,218.7L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'
								/>
							</svg>
						</div>
					</div>

					{/* Questions & Answers */}
					<div className='m-auto text-center text-lg space-y-3 text-green-900 '>
						{!selectedQuestion ? (
							renderQuestionButtons()
						) : (
							<div className='mt-4 space-y-2 text-base'>
								{renderQuestionButtons()}
							</div>
						)}
					</div>

					{/* User & Bot Messages */}
					<div className='space-y-4'>
						{messages.map((msg, index) => {
							const isLastBotMessage =
								msg.type === 'bot' &&
								messages.slice(index + 1).findIndex((m) => m.type === 'bot') ===
									-1; // يتأكد إن مفيش رسالة بعدها من البوت

							return (
								<div
									key={index}
									className={`flex ${
										msg.type === 'user' ? 'justify-end' : 'justify-start'
									}`}>
									{msg.type === 'bot' ? (
										<div className='flex items-start space-x-2 ms-1 me-3 md:me-7'>
											{/* أيقونة البوت */}
											<div className='text-2xl bg-green-400 text-white h-10 w-10 rounded-full flex justify-center items-center'>
												<RiRobot2Fill />
											</div>

											{/* رسالة البوت */}
											<div className='flex flex-col space-y-1 max-w-60 md:max-w-72'>
												<div className='bg-green-100 p-3 rounded-3xl rounded-tl text-green-600 break-words'>
													{isLastBotMessage ? (
														// الرسالة الأخيرة فقط تظهر بأنيميشن
														<TypeAnimation
															sequence={[50, msg.text]}
															wrapper='span'
															speed={60}
															repeat={0}
														/>
													) : (
														// الرسائل السابقة تظهر بدون أنيميشن
														msg.text
													)}
												</div>
												<div className='text-xs text-green-300 mt-2 mx-4 self-start'>
													CUDA {msg.time}
												</div>
											</div>
										</div>
									) : (
										// رسالة المستخدم
										<div className='flex max-w-xs space-x-1 ms-5 md:ms-10 me-1 rounded-full'>
											<div className='flex flex-col space-y-1 max-w-xs ms-5 md:ms-10'>
												<div className='p-3 rounded-3xl bg-green-400 text-white rounded-tr break-words'>
													{msg.text}
												</div>
												<div className='text-xs text-green-300 mt-2 mx-4 self-end'>
													{msg.time}
												</div>
											</div>
											<div className='text-2xl mx-2 bg-green-400 p-2 text-white rounded-full w-9 h-9 flex justify-center items-center'>
												<FaSmile />
											</div>
										</div>
									)}
								</div>
							);
						})}
					</div>

					{/* Typing Indicator */}
					{isTyping && (
						<div className='flex justify-start mx-3'>
							<div className='flex flex-col space-y-1 max-w-xs'>
								<div className='p-3 bg-gray-200 rounded-2xl inline-block'>
									<motion.div
										className='typing-dots flex space-x-1'
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.5, ease: 'easeInOut' }}>
										{/* الدوائر المتحركة مع تأثير الموجة */}
										<motion.span
											className='dot bg-green-600 w-2 h-2 rounded-full'
											animate={{
												y: [0, -6, 0], // حركة لأعلى ولأسفل
												scale: [1, 1.5, 1], // تأثير تكبير وتصغير
											}}
											transition={{
												duration: 0.6,
												repeat: Infinity,
												repeatType: 'loop',
												delay: 0,
											}}></motion.span>
										<motion.span
											className='dot bg-green-600 w-2 h-2 rounded-full'
											animate={{
												y: [0, -6, 0],
												scale: [1, 1.5, 1],
											}}
											transition={{
												duration: 0.6,
												repeat: Infinity,
												repeatType: 'loop',
												delay: 0.2, // التأخير لإنشاء تأثير الموجة
											}}></motion.span>
										<motion.span
											className='dot bg-green-600 w-2 h-2 rounded-full'
											animate={{
												y: [0, -6, 0],
												scale: [1, 1.5, 1],
											}}
											transition={{
												duration: 0.6,
												repeat: Infinity,
												repeatType: 'loop',
												delay: 0.4, // التأخير لإنشاء تأثير الموجة
											}}></motion.span>
									</motion.div>
								</div>
							</div>
						</div>
					)}

					<div ref={chatEndRef} />
				</div>

				{/* Input */}
				<div className='flex items-center p-2 bg-green-100 rounded-b-2xl'>
					<input
						type='file'
						ref={fileInputRef}
						className='hidden'
						onChange={handleFileChange}
					/>
					<button
						onClick={handleFileClick}
						aria-label='إعدادات'
						className='flex items-center'>
						<MdAttachFile className='w-7 h-7 text-green-600 hover:scale-110 transition-transform duration-300 ease-in-out' />
					</button>
					<div className='relative flex-grow'>
						<div className='flex items-center rounded-2xl p-2'>
							{showEmojiPicker && (
								<div className='absolute bottom-full mb-2'>
									<EmojiPicker onEmojiClick={handleEmojiClick} />
								</div>
							)}
							<input
								type='text'
								ref={inputRef}
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								onKeyDown={handleKeyDown}
								className='flex-grow border-none p-3 rounded-2xl me-2 focus:outline-none text-green-600'
								placeholder='Type a message...'
							/>
							<button
								onClick={toggleEmojiPicker}
								aria-label='إعدادات'
								className='flex items-center'>
								<MdInsertEmoticon className='w-7 h-7 text-green-600 hover:scale-110 transition-transform duration-300 ease-in-out' />
							</button>
						</div>
					</div>
					<button
						onClick={handleSendMessage}
						aria-label='إعدادات'
						className='bg-green-500 text-white hover:text-green-600 transition-all duration-300 ease-in-out p-2 rounded-full'>
						<MdSend className='w-6 h-6' />
					</button>
				</div>
			</div>
			<style jsx>{`
				.custom-scrollbar::-webkit-scrollbar {
					width: 8px;
				}
				.custom-scrollbar::-webkit-scrollbar-thumb {
					background-color: #f1a661;
					border-radius: 10px;
				}
				.custom-scrollbar::-webkit-scrollbar-track {
					background-color: transparent;
				}
				.typing-dots .dot {
					animation: bounce 1s infinite;
				}
				@keyframes bounce {
					0%,
					100% {
						transform: translateY(0);
					}
					50% {
						transform: translateY(-5px);
					}
				}
			`}</style>
		</div>
	);
};

export default AImessage;
