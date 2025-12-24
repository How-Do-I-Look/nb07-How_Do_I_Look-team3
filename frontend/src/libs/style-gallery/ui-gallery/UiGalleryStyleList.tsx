import classNames from 'classnames/bind'
import styles from './UiGalleryStyleList.module.scss'
import GalleryCard from '@libs/style-gallery/ui-gallery/GalleryCard'
import { GalleryStyle } from '@services/types'
import EmptyData from '@libs/shared/empty-data/EmptyData'

const cx = classNames.bind(styles)
const dummyGalleryStyles: GalleryStyle[] = [
  {
    id: 101,
    thumbnail: "https://picsum.photos/id/1084/300/400", // StyleDetail.imageUrls의 첫 번째 요소와 유사
    tags: ["미니멀", "오피스", "가을"], // Tag.name 배열
    title: "뉴트럴 톤 미니멀 오피스룩",
    content: "가을에 어울리는 베이지와 화이트 톤을 활용한 깔끔한 코디입니다. 출퇴근 복장으로 추천합니다.",
    nickname: "오피스_김",
    viewCount: 850,
    curationCount: 55,
    // CategoryKey 및 CategoryValue를 포함하는 'categories' 객체
    categories: {},
  },
  {
    id: 102,
    thumbnail: "https://picsum.photos/id/1074/300/400",
    tags: ["스트릿", "힙", "신발"],
    title: "힙한 스트릿 패션, 청키 스니커즈 포인트",
    content: "오버핏 후드티와 조거 팬츠로 편안함을 살리고 청키 스니커즈로 포인트를 준 스트릿 코디입니다.",
    nickname: "스트릿_Lee",
    viewCount: 1240,
    curationCount: 98,
    categories: {},
  },
];
type UiGalleryStyleListProps = {
  styles: GalleryStyle[]
}

const UiGalleryStyleList = ({ styles }: UiGalleryStyleListProps) => {

  if (styles.length === 0) return (
    <div className={cx('emptyStyleWrapper')}>
      <EmptyData text='아직 스타일이 없어요' />
    </div>
  )

  return (
    <div className={cx('container')}>
      {styles.map((style) => (
        <GalleryCard card={style} key={style.id} />
      ))}

    </div>

  )
}

export default UiGalleryStyleList
