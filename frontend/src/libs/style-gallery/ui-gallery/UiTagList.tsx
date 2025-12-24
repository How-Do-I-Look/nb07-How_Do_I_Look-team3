import classNames from 'classnames/bind'
import styles from './UiTagList.module.scss'
import Tag from '@libs/shared/tag/tag/Tag'

const cx = classNames.bind(styles)

type UiTagListProps = {
  tags: string[]
}

const UiTagList = ({ tags }: UiTagListProps) => {
  const tagsToDisplay = tags || [];
  return (
    <div className={cx('container')}>
      <Tag value='' />
      {tagsToDisplay.map((tag) => (
        <Tag value={tag} key={tag} />
      ))}
    </div>
  )
}

export default UiTagList
