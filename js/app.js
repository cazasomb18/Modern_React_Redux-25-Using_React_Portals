////////////////////////////////////////////////////////////////////////////////////////////////////
//Using React Portals

	//GOAL: delete stream page
		//when user arrives: we'll show a modal
			//prompts user to take immediate action, won't go away until it's resolved

	//all our react elements are nested into our <div id="root">

	//Here's why it's challenging create a modal with ONLY react
	//We'll see why it's challenging create a modal by making a side app with plain html

	//in public/create modal.html:
		<head>
		<style>
			.sidebar {
				position: fixed;
				top: 0;
				left: 0;
				width: 300px;
				height: 100vh;
				background-color: green;
			}

			.content {
				margin-left: 300px;
			}
		</style>
	</head>
	<body>
		<div class="sidebar">I am a side bar
		</div>
		<div class="content">
			<h1>I am some content</h1>
		</div>
	</body>
		//now navigate to localhost:3000/modal.html to show to file
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//More on Using Portals

	//in public/modal.html:
	//MODAL EXAMPLE:
		<head>
		<style>{/*css rules...*/}
			.sidebar {
				position: fixed;
				top: 0;
				left: 0;
				width: 300px;
				height: 100vh;
				background-color: green;
				z-index: 0;
			}
			.content {
				margin-left: 300px;
			}
			.modal-body {
				background-color: white;
				margin: auto;
				height: 30%;
				width: 30%;
			}

			.modal {
				height: 100%;
				width: 100%;
				position: fixed;
				background-color: grey;
				left: 0;
				top: 0;
				z-index: 10;
				//higher value, higher priority to be display on top of screen
			}
			.positioned {
				position: relative;
				z-index: 999;
			}
		</style>
	</head>
	<body>
		<div class="positioned">
		<div class="modal">{/* background*/}
			<div class="modal-body">{/* foreground*/}
				<h1>I am a modal</h1>
			</div>
		</div>
		</div>
		<div class="sidebar">I am a side bar
		</div>
		<div class="content">
			<h1>I am some content</h1>
		</div>
	</body>
	//issue: side bar still visible on left, ideally we want the sidebar BEHIND the modal
	//to fix we can use the css rule z-index: controls which element is on top of which


	//Stacking Context:
		//When two elements have the same z-index (z-index: 0 === z-index: undefined)
			//--> element listed last will be placed on bottom automatically

	//In summation, using modals in react w/ html is not really a good solution, nor are any of
	//the workarounds for any of these situations

	//Solution: rather than showing the modal as a child of posoitioned, we'll show modal as a child of
	//the body
		//Portals allows us to do this:
			//we dont' have to stick w/ component hierarchy
				//can say, StreamDelete, we want you to render as a modal component
					//BUT NOT AS A DIRECT CHILD, 
						//render it as a child in some other element in our html hierarchy
							//such as: <body>

						//body 
		//positioned 		sidebar 		modal
		//zindex: 0 		zindex: 0 		zindex: 999
			//<div class='modal'></div> is now a direct child of the body
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating a Portal

	//Let's create a modal element:
	//create src/components/Modal.js:

		import React from 'react';
		import ReactDOM from 'react-dom';
		const Modal = (props) => {
			return ReactDOM.createPortal(
				<div className="ui dimmer modals visible active">{/*background*/}
					<div className="ui standard modal visible active">{/*foreground*/}
						asdf;klajsdf;lkajsdf;lkajsdf;lkj
					</div>
				</div>,
				document.querySelector('#modal');
				//reference to <div id="modal"></div>
			);
		};
		export default Modal;

	//public/index.html:
		<div id="root"></div>
    	<div id="modal"></div>
    		//create div w/ id modal underneath root div

    //Now modal will be rendered into the div w/ the id="modal"

    //StreamDelete:
    import React from 'react';
	import Modal from '../Modal';//import modal
	const StreamDelete = () => {
		return(
			<div>
				StreamDelete
				<Modal/>{/*render modal*/}
			</div>
		);
	};
	export default StreamDelete;

    //navigate to localhost:3000/streams/delete to see this modal now:
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Hiding a Modal

	//We're going to clean up the look of our modal with some styling and semantic ui:
		//semantic-ui.com --> models > modal > actions:
			//example of structure:
			<div className="ui modal">
				<div className="header"></div>
				<div className="content">
					<p></p>
				</div>
				<div className="actions">
					<div></div>
					<div></div>
				</div>
			</div>
			//we're making use of the styling but none of the JS functionality included in ui

	//Modal.js:
		const Modal = (props) => {
			return ReactDOM.createPortal(
				<div className="ui dimmer modals visible active">
					<div className="ui standard modal visible active">
						<div className="header">Delete Stream</div>
						<div className="content">
							Are you sure you want to delete this stream?
						</div>
						<div className="actions">
							<button className="ui primary button">Delete</button>
							<button className="ui button">Delete</button>
						</div>
					</div>
				</div>,
				document.querySelector('#modal')
			);
		};
		//Now this looks great but there's just a few issues:
			//when we click off the modal it still shows:
				//if user clicks of background div we want to navigate somewhere else
					//can use history object:

	//Modal.js:
		import history from '../history';//import history

		const Modal = (props) => {
			return ReactDOM.createPortal(
				<div onClick={() => history.push('/')} className="ui dimmer modals visible active">
										{/*click on background div === nav to '/'*/}
					<div onClick={(e)=> e.stopPropagation()} className="ui standard modal visible active">
										{/*stops event bubbling*/}
						<div className="header">Delete Stream</div>
						<div className="content">
							Are you sure you want to delete this stream?
						</div>
						<div className="actions">
							<button className="ui primary button">Delete</button>
							<button className="ui button">Cancel</button>
						</div>
					</div>
				</div>
			)
		};
		//Now we need to try to make this Modal.js code reusable...
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Making the Modal Reusable

	//GOAL: configure the modal based upon some props that gets passed into it from the parent component
	
	//Incredibly likely that we may want to reuse this component: would be hard b/c we have all this 
	//hard-coded text

	//StreamDelete.js:
		const StreamDelete = () => {
			actions = (
				<div>
					<button className="ui button negative">Delete</button>
					<button className="ui button">Cancel></button>
				</div>
			);//JSX FRAGMENT ^^^
			return(
				<div>
					StreamDelete
					<Modal
						title="Delete Stream" 
						content="Are you sure you want to delete this stream?" 
						actions={actions}
					{/*passing properties from parent to child*/}
					/>
				</div>
			);
		};
	//Modal.js:
		const Modal = (props) => {
			return ReactDOM.createPortal(
				<div onClick={() => history.push('/')} className="ui dimmer modals visible active">
					<div onClick={(e)=> e.stopPropagation()}className="ui standard modal visible active">
						<div className="header">Delete Stream</div>
						<div className="content">{props.content}</div>
												{/*now content is passed w/ props*/}
						<div className="actions">{props.actions}</div>
												{/*now actions is passed w/ props*/}
					</div>
				</div>,
				document.querySelector('#modal')
			);
		};
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//React Fragments

	//Issue: there's a styling issue w/ the bottom of the 'actions' div b/c have a nested div inside
	//Solution: <React.Fragment>
	
	//React.Fragment: is a jsx looking element that'll allow us to return multiple elements to a single var,
	//but when rendered on screen doesn't actually get rendered as html
		//think of it as an invisible element that has no impact on the DOM whatsoever

	//StreamDelete.js:
		const actions = (
			<React.Fragment>
				<button className="ui button negative">Delete</button>
				<button className="ui button">Cancel</button>
			</React.Fragment>
		);
		//Use a fragment whenever you want to return multiple jsx elements but not have any presence
		//on the DOM.
	//you can also use them like this:
		/*
		const actions = (
			<>
				<button className="ui button negative">Delete</button>
				<button className="ui button">Cancel</button>
			</>
		)*/
			//YOUR CODE EDITOR DOES NOT RECOGNIZE THIS...
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//On Dismiss to The Parent

	//We might want to do something else in the onClick func in the Modal 1st <div>
		//as a result we want this onClick handler to come from the parent component:

		//delete history import from Modal.js and add to StreamDelete.js:
		//add onDismiss as prop in <Modal/>:
			<Modal
				title="Delete Stream" 
				content="Are you sure you want to delete this stream?" 
				actions={actions} 
				onDismiss={()=> history.push('/')}
			/>
				//now our component is completely controlled by the parent
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Reminder on Path Params
	
	//There are a few more things we need to do with StreamDelete:
		//Make sure when we click on 'delete' that we actually delete the stream
		//Click on 'cancel' dismiss the modal
		//Would be nice if we could print title on the content div in the modal
			//so user knows which stream they're about to delete
			//Need to have stream loaded up into our app
				//we did this in EditStream: need to fetch stream w/ id before we can show this

	//Let's show modal when user navigates to "/streams/delete/:id"
	//App.js:
		<Route path="/streams/delete/:id" exact component={StreamDelete} />

	//Now we need to navigate to the DeleteStream comp when 'DELETE' clicked
	//StreamList.js:
		<Link to={`/streams/delete/${stream.id}`} className="ui button negative">DELETE</Link>
		//change button to Link to 'streams/delete/id' interpolating the stream.id
			//now clicking 'delete' navigates us to our modal
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Fetching the Deletion System
	
	//StreamDelete.js refactor:
		class StreamDelete extends React.Component {
			//Change to class-based component
			renderActions(){
			//throw const actions into helper method(){} that returns the React.Fragment
				return (
					<React.Fragment>
						<button className="ui button negative">Delete</button>
						<button className="ui button ">Cancel</button>
					</React.Fragment>
				);
			}
			render(){
				return(
					<div>
						StreamDelete
						<Modal
							title="Delete Stream" 
							content="Are you sure you want to delete this stream?" 
							actions={this.renderActions()} 
							//replace actions props on <Modal/> with renderActions() and call it
							onDismiss={()=>history.push('/')}
						/>
					</div>
				)
			}
		}
	//Now we're passing the jsx fragments and rendering the action buttons
	//from the parent comp to child 
		//this helps encapsulate our logic to the parent level logic making the 
		//Modal more configurable



	//Now that we know we have the id at this.props.match.params.id, let's call it with AC fetchStream()
	//in cdm:
	//StreamDelete.js:
		import React from 'react';
		import { connect } from 'react-redux';
		//import connect from 'react-redux'

		import Modal from '../Modal';
		import history from '../../history';
		import { fetchStream } from '../../actions';
		//import fetchStream from actions;

		class StreamDelete extends React.Component {
			componentDidMount(){
				this.props.fetchStream(this.props.match.params.id)
				//now we can call AC inside of cdm w/ id: fetchStream(id)
			}
			renderActions(){
				return (
					<React.Fragment>
						<button className="ui button negative">Delete</button>
						<button className="ui button ">Cancel</button>
					</React.Fragment>
				);
			}
			render(){
				return(
					<div>
						StreamDelete
						<Modal
							title="Delete Stream" 
							content="Are you sure you want to delete this stream?" 
							actions={this.renderActions()} 
							onDismiss={()=>history.push('/')}
						/>
					</div>
				)
			}
		}
		export default connect(
			null,
			{ fetchStream })(StreamDelete);
			//wire up action creator
	//to check open network tab in browser console filter by xhr requests
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Conditionally Showing Stream Details

	//Now that we're wired up the AC and connect to StreamDelete, we can show some details about the
	//file to be deleted in the Modal


	//DeleteStream.js now looks like this:
		import React from 'react';
		import { connect } from 'react-redux';
		import Modal from '../Modal';
		import history from '../../history';
		import { fetchStream } from '../../actions';

		class StreamDelete extends React.Component {
			componentDidMount(){
				this.props.fetchStream(this.props.match.params.id)
				console.log("PROPS, SD: ", this.props)
			}
			renderActions(){
				return (
					<React.Fragment>
						<button className="ui button negative">Delete</button>
						<button className="ui button ">Cancel</button>
					</React.Fragment>
				);
			}
			//define new method for rendering modal content:
			renderContent(){
			//Now we need to conditionally render the stream details:
				if (!this.props.stream) {
					return 'Are you sure you want to delete this stream?'
					//We want to show modal right away, 
				}

				return `Are you sure you want to delete the stream with title: ${this.props.stream.title}?`
				//then we'll render the title in the 'content' div in modal
			}

			render(){
				return(
					<Modal
						title="Delete Stream" 
						content={this.renderContent()} 
						//call this method in render(){}:
						actions={this.renderActions()} 
						onDismiss={()=>history.push('/')}
					/>
				);
			}
		}
		//configure our mapSTateToProps function:
		const mapStateToProps = (state, ownProps) => {
			const id = ownProps.match.params.id;
			return { stream: state.streams[id] };
			//returns correct stream w/ getting id our of ownProps
		}

		export default connect(
			mapStateToProps,
			//include mapStateToProps in connect!!
			{ fetchStream })(StreamDelete);
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Deleting a Stream

	//GOAL: make sure 'delete' and 'cancel' buttons actually do something:
		//'cancel': we want same behavior as user clicking in background
			//we'll do this with programmatic navigation
		//'delete': 
			//call action creator w/ this record's id

	//StreamDelete.js refactor:
		import React from 'react';
		import { connect } from 'react-redux';
		import { Link } from 'react-router-dom';
		//import link
		import Modal from '../Modal';
		import history from '../../history';
		import { deleteStream, fetchStream } from '../../actions';
		class StreamDelete extends React.Component {
			componentDidMount(){
				this.props.fetchStream(this.props.match.params.id)
				console.log("PROPS, SD: ", this.props)
			}
		//renderActions(){}: 
			renderActions(){
				const { id } = this.props.match.params;
				//extract id out to a variable
				return (
					<React.Fragment>
						<button 
							onClick={()=> this.props.deleteStream(id)} 
							{/*now we want to call an action creator when we click the 'delete' button:*/}
							className="ui button negative"
						>
							Delete
						</button>
						<Link to="/" className="ui button ">Cancel</Link>
						{/*show link instead of button assign 'to' prop*/}
					</React.Fragment>
				);
			}
			renderContent(){
				if (!this.props.stream) {
					return 'Are you sure you want to delete this stream?'
				}
				return `Are you sure you want to delete the stream with title: ${this.props.stream.title}?`
			}
			render(){
				return(
					<Modal
						title="Delete Stream" 
						content={this.renderContent()} 
						actions={this.renderActions()} 
						onDismiss={()=>history.push('/')}
					/>
				);
			}
		}
		const mapStateToProps = (state, ownProps) => {
			const id = ownProps.match.params.id;
			return { stream: state.streams[id] };
		}

		export default connect(
			mapStateToProps,
			{ deleteStream, fetchStream })(StreamDelete);
		//now we just need to be able to show a stream to a user and play some video:
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Exercise Overview - Closeing the Modal
	//When showind a modal there are 3 different ways we want the user to close it:
		//clicking on the background
		//clicking the close button
		//clicking the x <i><i/> element on the modal 
	//In this example there is an <i/> added, let's make sure when we click it it closes modal
		//look at modal.js file
			//inside there's a new <i className="close icon" />



////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Closing the Modal: Coding exercise 15

	//SOLUTION:
	//modal.js:
		import React from 'react';
		import ReactDOM from 'react-dom';
		export const Modal = (props) => {
		    return ReactDOM.createPortal(
		        <div onClick={props.onDismiss} className="ui dimmer modals visible active">
		            <div
		                onClick={e => e.stopPropagation()}
		                className="ui standard modal visible active"
		            >
		                <i 
		                    className="close icon" 
		                    onClick={() => props.onDismiss()}
		                	{/*^^^^^ SOLUTION ^^^^^*/}
		                >
		                </i>
		                <div className="header">{props.title}</div>
		                <div className="content">{props.content}</div>
		                <div className="actions">{props.actions}</div>
		            </div>
		        </div>,
		        document.querySelector('section')
		    );
		}
////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////
//Coding Exercise 15 Solution: Closing the Modal
	//REMEMBER...

	<i className="close icon" onClick={onDismiss}></i>
		//THIS! 					^^^^^^^^^^^^^^^

	//IS THE SAME AS...

	<i className="close icon" onClick={() => onDismiss}></i>
		//THIS! 							^^^^^^^^^^^^^^^
////////////////////////////////////////////////////////////////////////////////////////////////////




