import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import NewContentContainer from './NewContentContainer';
import Header from './Header';
import Board from './Board';
import styled from 'styled-components';

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	margin: auto;
	overflow: auto;
	width: 95%;
`;

const InnerContainer = styled.div`
	display: flex;
	flex-direction: column;
	overflow: auto;
`;

const BoardsContainer = styled.div`
	display: flex;
	margin: 0 auto;
`;

export default class PinboardCreator extends Component {
	componentDidMount = () => {
		if (!this.props.data) {
			const board0 = {
				id: 'board0',
				title: 'Fresh Content',
				contentIds: [0],
			};
			const boardOrder = ['board0'];
			const initialState = {
				data: {
					content: {},
					boards: {
						[board0.id]: board0,
					},
					boardOrder,
				},
			};

			this.props.updateBoards(initialState);
		}
	};

	handleDragEnd = (result) => {
		const { destination, source, draggableId, type } = result;

		// Invalid Drag
		if (!destination) return;
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		)
			return;

		// BOARDS
		if (type === 'board') {
			const newBoardOrder = Array.from(this.props.data.boardOrder);
			newBoardOrder.splice(source.index, 1);
			newBoardOrder.splice(destination.index, 0, draggableId);

			const newState = {
				...this.props,
				data: {
					...this.props.data,
					boardOrder: newBoardOrder,
				},
			};

			this.props.updateBoards(newState);
			return;
		}

		// CONTENT
		const start = this.props.data.boards[source.droppableId]; // Start Board
		const finish = this.props.data.boards[destination.droppableId]; // Finish Board

		// Dragging Content into Trash
		if (destination.droppableId === 'trash') {
			this.deleteContent(draggableId, start, source);
			return;
		}

		// If more than 5 in finish board, do not drop Content
		if (
			start !== finish &&
			finish.contentIds.length > 5 &&
			destination.droppableId !== 'board0'
		) {
			alert('You can only have up to 5 pieces of Content in a Board!');
			return;
		}

		// Dragging Content within Board
		if (start === finish) {
			const newContentIds = Array.from(start.contentIds);
			newContentIds.splice(source.index, 1);
			newContentIds.splice(destination.index, 0, draggableId);

			const newBoard = {
				...start,
				contentIds: newContentIds,
			};

			const newState = {
				...this.props,
				data: {
					...this.props.data,
					boards: {
						...this.props.data.boards,
						[newBoard.id]: newBoard,
					},
				},
			};

			this.props.updateBoards(newState);
			return;
		}

		// Dragging Content between Boards
		const startContentIds = Array.from(start.contentIds);
		startContentIds.splice(source.index, 1);
		const newStart = {
			...start,
			contentIds: startContentIds,
		};

		const finishContentIds = Array.from(finish.contentIds);
		finishContentIds.splice(destination.index, 0, draggableId);
		const newFinish = {
			...finish,
			contentIds: finishContentIds,
		};

		const newState = {
			...this.props,
			data: {
				...this.props.data,
				boards: {
					...this.props.data.boards,
					[newStart.id]: newStart,
					[newFinish.id]: newFinish,
				},
			},
		};

		this.props.updateBoards(newState);
	};

	createBoard = () => {
		const title = prompt('What is the title of the board?');
		const id = uuidv4();
		const newBoard = {
			id,
			title,
			contentIds: [0],
		};
		const newBoardOrder = Array.from(this.props.data.boardOrder);
		newBoardOrder.splice(1, 0, id);

		const newState = {
			...this.props,
			data: {
				...this.props.data,
				boards: {
					...this.props.data.boards,
					[newBoard.id]: newBoard,
				},
				boardOrder: newBoardOrder,
			},
		};

		this.props.updateBoards(newState);
	};

	deleteBoard = (boardId, boardTitle) => {
		if (
			confirm(
				`Are you sure you want to delete ${boardTitle} along with all of its content?`
			)
		) {
			const newBoardOrder = Array.from(this.props.data.boardOrder).filter(
				(e) => e !== boardId
			);

			const newState = {
				...this.props,
				data: {
					...this.props.data,
					boardOrder: newBoardOrder,
				},
			};

			this.props.updateBoards(newState);
		}
	};

	createContent = () => {
		const url = prompt('Enter the url: ');
		const quickThoughts = prompt('Enter Quick Thoughts: ');
		const category = prompt('Enter category: '); // this would be from a dropdownlist
		const id = uuidv4();
		const newCard = {
			id,
			url,
			quickThoughts,
			category,
		};
		const content = {
			...this.props.data.content,
			[newCard.id]: newCard,
		};
		const board0 = {
			...this.props.data.boards.board0,
			contentIds: [id, ...this.props.data.boards.board0.contentIds],
		};
		const boards = {
			...this.props.data.boards,
			board0,
		};
		const newState = {
			...this.props,
			data: {
				...this.props.data,
				content,
				boards,
			},
		};
		this.props.updateBoards(newState);
	};

	deleteContent = (draggableId, start, source) => {
		if (
			confirm(
				`Are you sure you want to delete content from ${this.props.data.content[draggableId].url} ?`
			)
		) {
			// TODO: fix url
			const { content } = this.props.data;
			content[draggableId] = '';

			const startContentIds = Array.from(start.contentIds);
			startContentIds.splice(source.index, 1);
			const newStart = {
				...start,
				contentIds: startContentIds,
			};

			const newState = {
				...this.props,
				data: {
					...this.props.data,
					boards: {
						...this.props.data.boards,
						[newStart.id]: newStart,
					},
				},
			};

			this.props.updateBoards(newState);
		}
	};

	render() {
		const { profileObj, data } = this.props;

		if (data) {
			return (
				<DragDropContext onDragEnd={this.handleDragEnd}>
					<Droppable
						droppableId="boardsContainer"
						direction="horizontal"
						type="board"
					>
						{(provided) => (
							<Container>
								<Header
									profileObj={profileObj}
									responseGoogleLogout={
										this.props.responseGoogleLogout
									}
									createBoard={this.createBoard}
									createContent={this.createContent}
								/>
								<NewContentContainer
									board0={data.boards.board0}
									content={data.content}
								></NewContentContainer>
								<InnerContainer className="hidden-scroll">
									<BoardsContainer
										ref={provided.innerRef}
										{...provided.innerRef}
									>
										{data.boardOrder.map(
											(boardId, index) => {
												const board =
													data.boards[boardId];

												let content = '';
												if (data.content) {
													content =
														board.contentIds.map(
															(contentId) =>
																data.content[
																	contentId
																]
														);
												}

												if (boardId !== 'board0') {
													return (
														<Board
															index={index}
															key={board.id}
															board={board}
															content={content}
															deleteBoard={
																this.deleteBoard
															}
														/>
													);
												}
												return '';
											}
										)}
										{provided.placeholder}
									</BoardsContainer>
								</InnerContainer>
							</Container>
						)}
					</Droppable>
				</DragDropContext>
			);
		}
		return <div></div>;
	}
}
