pragma solidity 0.8.17;

pragma experimental ABIEncoderV2;

interface IUniswapV3Pool {
    function token0() external view returns (address);
    function token1() external view returns (address);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
}