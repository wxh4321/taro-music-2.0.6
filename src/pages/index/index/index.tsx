import Taro,{ Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CommonBar from '../../../components/commonBar/index'
import PlayDetail from '../../playDetail/playDetail'
import Recommend from '../../recommend/recommend'
import NewSong from '../../newSong/newSong'
import Album from '../../album/album'
import { getCacheData, setCacheData } from '../../../utils/index'
import { fetchRecommendList,fetchAlbumList,fetchNewestList, updateState } from '../../../actions'
import './index.scss'

interface TabItem {
  id: number;
  title: string
}
const tabs: Array<TabItem> = [
  {id: 0, title: '推荐歌单'},
  {id: 1, title: '最新单曲'},
  {id: 2, title: '新碟上架'},
]

interface IndexStates {
  activeTab: number;
  tabs: Array<TabItem>
}
interface Index{
  onFetchRecommendList: (payload: { callback: any }) => any;
  onFetchAlbumList: (payload: { callback?: any, initOffset?: number, isInit?: boolean }) => any;
  onFetchNewestList: (payload: { callback: any }) => any;
  onUpdateState: (namespace: string, payload: any) => any;
}
const mapStateToProps = ({}) => ({})
const mapDispatchToProps = ({
  onFetchRecommendList: fetchRecommendList,
  onFetchAlbumList:fetchAlbumList,
  onFetchNewestList: fetchNewestList,
  onUpdateState: updateState,
})

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component<any, IndexStates> {
  state = {
    activeTab: 0,
    tabs: [...tabs]
  }
  
  componentDidMount() {
    // this.getCacheList()

  }
  // getCacheList() {
  //   this.refs.Recommend.getRecommendList()
  //   this.refs.NewSong.getNewest()
  //   this.refs.Album.fetchAlbum(null, null, false, !!this.$router.params.tab)
  // }

  fetchAlbum(callback?: any, initOffset?: number, isInit?: boolean, isUnLoad?: boolean) {
    if (isUnLoad) return
    this.props.onFetchAlbumList({ callback, initOffset, isInit })
  }
  fetchNewest(callback) {
    this.props.onFetchNewestList({ callback })
  }
  fetchRecommendList(callback?: any) {
    this.props.onFetchRecommendList({ callback })
  }
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
  }
  isCache() {
    return {
      newSong: getCacheData('newSongList') && getCacheData('newSongList').length > 0,
      recommend: getCacheData('recommendList') && getCacheData('recommendList').length > 0,
      album: getCacheData('albumList') && getCacheData('albumList').length > 0,
    }
  }
  switchTab(index, init) {

    if (this.state.activeTab === index && !init) return
    this.setState({
      activeTab: index
    })
    switch (index) {
      case 0:
        !this.isCache().recommend && this.fetchRecommendList()
        break
      case 1:
        !this.isCache().newSong && this.fetchNewest({})
        break
      case 2:
        this.fetchAlbum(null, 0, false, true)
        break
      default:
        break;
    }
  }
  // 停止下拉刷新
  stopPullDownRefresh() {
    Taro.stopPullDownRefresh()
  }
  // 刷新数据
  refresh() {
    let activeTab = this.state.activeTab
    switch (activeTab) {
      case 0:
        setCacheData('newSongList', [])
        this.fetchRecommendList(this.stopPullDownRefresh)
        break
      case 1:
        setCacheData('recommendList', [])
        this.fetchNewest(this.stopPullDownRefresh)
        break
      case 2:
        setCacheData('albumList', [])
        this.fetchAlbum(this.stopPullDownRefresh, 0, true)
        break
      default:
        break
    }
  }
  render() {
    return (
      <View className='play-wrapper wrapper'>
        {/* 主体 */}
        <View className='home-wrapper'>
          <View className='home-tab'>
            {
              this.state.tabs.map((data, k) => {
                return (
                  <View key={k} className={`tab ${this.state.activeTab === k ? 'cur' : ''}`} onClick={this.switchTab.bind(this, k)}>{data.title}</View>
                )
              })
            }
          </View>
          <View className='home-tab-wrapper'>
            <View className='swiper-wrapper'>
              <View className='swiper-slide' hidden={this.state.activeTab == 0 ? false : true}>
                <Recommend/>
              </View>
              <View className='swiper-slide' hidden={this.state.activeTab == 1 ? false : true}>
                <NewSong/>
              </View>
              <View className='swiper-slide' hidden={this.state.activeTab == 2 ? false : true}>
                <Album/>
              </View>
            </View>
          </View>
        </View>
        <PlayDetail />
        <CommonBar />
      </View>
    )
  }
}

export default Index