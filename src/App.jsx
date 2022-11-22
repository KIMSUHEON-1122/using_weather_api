/*
  현재 내 위치기반 날씨 가져오기
  https://openweathermap.org
  로딩스피너추가
https://www.npmjs.com/package/react-spinners
  */
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import WeatherButton from "./components/WeatherButton";
import WeatherBox from "./components/WeatherBox";
import ClipLoader from "react-spinners/ClipLoader";

function App() {
	const [weather, setWeather] = useState(null); //데이타 존재여부
	const [city, setCity] = useState(""); //버튼에서 선택한 도시
  const [loading, setLoading] = useState(false);//로딩스피너상태
	const cities = ["London", "New york", "Bangkok", "seoul"]; // 버튼, 도시들을 배열로

	const getCurrentLocation = () => {
		navigator.geolocation.getCurrentPosition((position) => {
			let lat = position.coords.latitude;
			let lon = position.coords.longitude;
			console.log('현재 내 위치는?',lat,lon)
			getWeatherByCurrentLocation(lat, lon);
		});
	};

	const getWeatherByCurrentLocation = async (lat, lon) => {
		let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=18dbac5dbef214af4aa38bf87c4b4ccd&units=metric`;
		setLoading(true);
    let response = await fetch(url); //비동기적, url을 호출해서 데이타를 가져올때가 기다려줘
		let data = await response.json();
		//fetch함수로 불러왔을때는 그대로 사용할 수 없음,json()으로 변환
		setWeather(data);
    setLoading(false);
	};

    //선택된 도시의 날씨를 가져오는 함수
    const getWeatherByCity = async() => {
      let url =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=18dbac5dbef214af4aa38bf87c4b4ccd&units=metric`;
      let response = await fetch(url);
      let data = await response.json();
      setWeather(data);
    };

  //현재위치날씨 버튼 작동하게 함수 정의
  const handleCityChange = (city) => {
    if(city === "current"){
      setCity("")
    }else{
      setCity(city);
    }
  }

	/* WeatherButton컴포넌트에서 클릭할때 설정된 city를 바궈줄때 함수 호출
  => 새로고침하면 에러! useEffect 2개인게 문제
	 */
  useEffect(() => {
		if(city===""){
      getCurrentLocation();
    }else{
      getWeatherByCity();
    }
	}, [city]);

	// 선택된 버튼 모양으 바꿔주기 위해 selectedCity={city}추가
	return (
		<>
      { loading ?
        (
          <div className="container">
            <ClipLoader 				
              color="white"
              size={120}
              loading={loading}
              aria-label="Loading Spinner"
              data-testid="loader"/>
          </div>
        )
        : 
        (
          <div className="container">
          <WeatherBox weather={weather} />
          <WeatherButton 
          cities={cities} 
          setCity={setCity} 
          handleCityChange = {handleCityChange}
          selectedCity = {city}/>
        </div>
        )
      }
		</>
	);
}

export default App;
