import React, {useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import {download} from '../assets'
import { downloadCanvasToImage, reader} from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes} from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import {AIPicker, FilePicker, ColorPicker, Tab, CustomButton} from '../components/index'
import { AlwaysCompare } from 'three'

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generationgImg, setGeneratingImg] = useState('');
  const [activeEditorTab, setActiveEditorTab] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
});

  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker/>
      case "filepicker":
        return <FilePicker
              file={file}
              setfile={setFile}
              readfile={readFile}/>
      case "aipicker":
        return <AIPicker
                prompt={prompt}
                setPrompt={setPrompt}
                generationgImg={generationgImg}
                handleSubmit={handleSubmit}/>
      default:
        return null;
    }
  }

  const handleSubmit = async(tyoe) => {
    if(!prompt) return alert("Please enter a prompt.");

    try {
    } catch (err){
      alert(err);
    } finally{
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  }

  const handelDecal = (type, results) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = results;
    if (!activeFilterTab[decalType.filterTab]) {
      handelActiveFilterTab(decalType.filterTab);
    }
  }
  const handelActiveFilterTab = (tabname) => {
    switch (tabname) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabname];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabname];
        break;
    
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
    }
    setActiveFilterTab((prev) => {
      return {
        ...prev,
        [tabname] : !prev[tabname]
      }
    })
  }

  const readFile = (type) => {
    reader(file).then((results) => {
      handelDecal(type, results);
      setActiveEditorTab("");
    })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div key="custom" className='absolute top-0 left-0 z-10' {...slideAnimation('left')}>
            <div className='flex items-center min-h-screen'>
              <div className='editortabs-container tabs'>
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))
                }
                {generateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation}>
                <CustomButton
                  type = "filled"
                  title = "Go Back"
                  handleClick={() => state.intro = true}
                  customStyles={"w-fit px-4 py-2.5 font-bold text-sm"}
                />
          </motion.div>
          <motion.div className='filtertabs-container' {...slideAnimation('up')}>
          {FilterTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    isFilterTab
                    isActiveTab = {activeFilterTab[tab.name]}
                    handleClick={() => handelActiveFilterTab(tab.name)}
                  />
          ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer