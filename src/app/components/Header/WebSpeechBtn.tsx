const WebSpeechBtn = () => {
  return (
    <button
      type="button"
      className={`ml-2 ${
        isWebSpeechEnabled
          ? 'text-gray-400 animate-pulse-once'
          : 'text-gray-500 cursor-not-allowed'
      }`}
      onClick={stopSpeaking}
      disabled={!isWebSpeechEnabled}
      title={
        isWebSpeechEnabled
          ? 'Stop Message'
          : 'Enable Web Speech to Stop ongoing Messages'
      }
    >
      <FontAwesomeIcon icon={faStop} fade={isStopFading} />
    </button>
  );
};

export default WebSpeechBtn;
