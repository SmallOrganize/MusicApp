import React from 'react';
import ReactPlayer from 'react-player';
import { 
	Row , 
	Col , 
	Button , 
	Card , 
	Icon , 
	Collapse , 
	message , 
	Spin , 
	Tabs , 
	Progress , 
	Tooltip ,
	Modal ,
	Tag 
} from 'antd';
import { allSongs } from '../Sources/SongInfo';
import LinkinPark from '../Assets/LinkinPark.png';
import Metallica from '../Assets/Metallica.jpg';
import GunsNRoses from '../Assets/GunsNRoses.jpg';
import GreenDay from '../Assets/GreenDay.jpg';
import Maroon5 from '../Assets/Maroon5.jpg';


const images = [LinkinPark,Metallica,GunsNRoses,GreenDay,Maroon5]
const Panel = Collapse.Panel;

const antIcon = <Icon type="loading" className="loader" spin />;
const TabPane = Tabs.TabPane;

class Home extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			currentURL:null,
			loop:false,
			artist:null,
			song:null,
			bg:null,
			loading:true,
			played:0,
			modal: false,
			viewArtist: null,
		}
	}

	componentDidMount(){
		document.addEventListener('keyup', this.hitSpaceKey , false)
	}

	componentDidUpdate(prevProps , prevState){

	}

	setUrl = (artist,song,bg,url) => {
		this.setState({
			currentURL: url,
			playing: true,
			loading: true,
			bg,
			artist,
			song
		})
		
	}

	hitSpaceKey = (e) => {
		if(e.which===32){
			this.playOrPause();
		}
	}

	playOrPause = () => {
		this.setState({
			playing:!this.state.playing
		})
	}

	setLoop = () => {
		this.setState({
			loop:!this.state.loop
		})
	}	

	renderPlayer = () => {
		if(this.state.currentURL){
			return (
				<Card className="player-controls">
					<Col span={10}>
						<div className="song-name">{this.state.song}</div>
						<div className="artist-name">{this.state.artist}</div>
					</Col>					
					{this.state.playing ? this.state.loading ? <span><Spin className="spinner" indicator={antIcon}/></span> : <Icon className="pause-btn" type="pause-circle" theme="filled" onClick={this.playOrPause}/> : <Icon className="play-btn" type="play-circle" theme="filled" onClick={this.playOrPause}/>}
					<Progress className="progress" type="line" percent={this.state.played} showInfo={false}/>
					<Tooltip title="Loop">{this.state.loop ? <Icon style={{color:'#1890ff'}} onClick={this.setLoop} type="retweet" className="loop" /> : <Icon style={{color:'#fff'}} onClick={this.setLoop} type="retweet" className="loop" />}</Tooltip>
				</Card>)
		}
		else{
			return false;
		}	
	}

	getProgress = (e) => {
		this.setState({
			played:e.played*100
		})
		if(e.playedSeconds>0){
			this.setState({
				loading:false
			})
		}
		if(e.played===1){
			this.setState({
				currentURL:null,
				played:0
			})
		}
	}

	handleError = (e) => {
		return (message.error("Failed to load Song!! Please try Again"))
	}

	openSongs = (artist) => {
		this.setState({
			modal: true,
			viewArtist: artist
		})
	}

	closeSongs = () => {
		this.setState({
			modal: false,
			viewArtist: null
		})
	}
	 
	renderSongs = () => {
		let artist = this.state.viewArtist
		let view = [];
		artist.songs.map((song,i) => {
			return view.push(<Button className="song-card" value={song.url} onClick={() => this.setUrl(artist.artist,song.name,artist.imgUrl,song.url)}>
			<div>{song.name} - <span className="album-text">{song.album}</span></div>
			{this.state.currentURL === song.url ? <Icon type="sound" /> : null}
		</Button>)
		})
		return <div className="scrollable">{view}</div>;
	}



	render(){
		return(<div id="body">
				<Tabs defaultActiveKey="1" className="tabs">
					{allSongs.map(genres=>{
						return <TabPane tab={genres.genre} key={genres.key}>
    					<div>
								{genres.list.map((artist,i)=>{
									return (<Col key={i} xl={6} lg={6} md={8} sm={12} xs={24} className="artist-container">
											<div className="artist-inner-cont">
												<img className="img-logo" src={images[artist.imgUrl]} alt="Not Available" onClick={() => this.openSongs(artist)}/>
											</div>
										</Col>)	
								})}	
							</div>
    				</TabPane>
					})}
  				</Tabs>
				{this.renderPlayer()}
				<ReactPlayer className="player" height="100px" url={this.state.currentURL} controls={false} playing={this.state.playing} loop={this.state.loop} onProgress={this.getProgress} onDuration={this.getDuration} onError={this.handleError} onReady={this.handleReady}/>
				<Modal
				centered
				title = {this.state.viewArtist ? "Songs by "+this.state.viewArtist.artist : null}
				footer = {null}
				onCancel = {this.closeSongs}
				visible = {this.state.modal}

				>
					{this.state.viewArtist ? this.renderSongs() : null}
				</Modal>
			</div>)
	}
}
export default Home