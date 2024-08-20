import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import axios from 'axios'
import { url } from '../const'
import Header from '../components/Header'
import './newTask.scss'
import { useNavigate } from 'react-router-dom'

const NewTask = () => {
  const [selectListId, setSelectListId] = useState()
  const [lists, setLists] = useState([])
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [dueDate, setDueDate] = useState('') // 追加
  const [errorMessage, setErrorMessage] = useState('')
  const [cookies,] = useCookies()
  const navigate = useNavigate()
  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleDetailChange = (e) => setDetail(e.target.value)
  const handleDueDateChange = (e) => setDueDate(e.target.value) // 追加
  const handleSelectList = (id) => setSelectListId(id)
  const onCreateTask = () => {
    const data = {
      title: title,
      detail: detail,
      done: false,
      limit: new Date(dueDate).toISOString() // 追加
    }

    axios
      .post(`${url}/lists/${selectListId}/tasks`, data, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then(() => {
        navigate('/')
      })
      .catch((err) => {
        setErrorMessage(`タスクの作成に失敗しました。${err}`)
      })
  }

  useEffect(() => {
    axios
      .get(`${url}/lists`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setLists(res.data)
        setSelectListId(res.data[0]?.id)
      })
      .catch((err) => {
        setErrorMessage(`リストの取得に失敗しました。${err}`)
      })
  }, [cookies.token])

  return (
    <div>
      <Header />
      <main className="new-task">
        <h2>タスク新規作成</h2>
        <p className="error-message">{errorMessage}</p>
        <form className="new-task-form">
          <label htmlFor='newTaskFrom'>リスト</label>
          <br />
          <select
            onChange={(e) => handleSelectList(e.target.value)}
            className="new-task-select-list"
            name='newTaskSelectList'
          >
            {lists.map((list, key) => (
              <option key={key} className="list-item" value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor='newTaskTitle'>タイトル</label>
          <br />
          <input
            name='newTaskTitle'
            type="text"
            onChange={handleTitleChange}
            className="new-task-title"
          />
          <br />
          <label htmlFor='newTaskDetail'>詳細</label>
          <br />
          <textarea
            type="text"
            name='newTaskDetail'
            onChange={handleDetailChange}
            className="new-task-detail"
          />
          <br />
          <label htmlFor='newTaskDueDate'>期日日時</label> {/* 追加 */}
          <br />
          <input
            name='newTaskDueDate'
            type='datetime-local'
            onChange={handleDueDateChange}
            className='new-task-due-date'
          />
          <button
            type="button"
            className="new-task-button"
            onClick={onCreateTask}
          >
            作成
          </button>
        </form>
      </main>
    </div>
  )
}

export default NewTask