import React, { useState, useEffect } from 'react'
import styles from './main.module.css'
import ToDo from '../todo/ToDo'
import PropTypes from 'prop-types'
import Tag from '../tag/Tag'
import { postToDo } from '../../api/todo.service'
import useToken from '../../middleware/useToken'
import { useDispatch } from 'react-redux'
import { setMessage } from '../../actions/message'

function Main (props) {
  const dispatch = useDispatch()
  const token = useToken()

  const [todos, setTodos] = useState([])
  useEffect(() => {
    setTodos(props.todos)
  }, [props.todos])

  const [types, setTypes] = useState([])
  useEffect(() => {
    console.log(props.todos)
    console.log(todos)
    setTypes([...new Set(todos.map((item) => item.type))])
  }, [...new Set(todos.map((item) => item.type))])

  const [newTodo, setNewTodo] = useState('')
  const [showCategories, setShowCAtegories] = useState(false)

  const handleChange = (event) => {
    setShowCAtegories(event.target.value !== '')
    setNewTodo(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setNewTodo(newTodo)
      const toDoDto = {
        title: newTodo,
        type: 'other',
        date: new Date(),
        state: 'Pending'
      }
      postToDo(token, toDoDto)
        .then((response) => {
          setTodos([...todos, toDoDto])
          setTypes([...new Set(todos.map((item) => item.type))])
          props.onTagsChange(todos)
        }).catch((error) => {
          console.log(error)
          dispatch(setMessage(error.response.data.data, error.response.data.status))
        })
    }
  }

  return (
    <div className={`${styles.container}`}>
      <input
        className={styles.editText}
        type="text"
        id="newTodo"
        name="newTodo"
        placeholder="Add new todo"
        value={newTodo}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      {showCategories && <div className={styles.categories}>
        {types.map(function (keyName, keyIndex) {
          return (
            <Tag key={keyIndex} name={keyName} number={undefined} />
          )
        })}
      </div>}

      <div className={styles.todos}>
        {
          Array.from(todos).map((item) => (
            <ToDo key={item.id}
              id={item.id}
              category={item.type}
              title={item.title}
              state={item.state} />
          ))
        }
      </div>
    </div>
  )
}

Main.propTypes = {
  onTagsChange: PropTypes.func,
  todos: PropTypes.array
}

export default Main
