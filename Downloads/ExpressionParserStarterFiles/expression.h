/*
 * expression.h
 *
 * Class declarations for expressions
 *
 * You should declare more classes and functionality to match
 * the target grammar. Don't forget to implement them in expression.cpp.
 */

#ifndef EXPRESSION_H_
#define EXPRESSION_H_

#include <stdint.h>

/**
 * Just a plain old expression
 */
class Expression
   {
public:

   virtual ~Expression( );

   virtual int64_t Eval( ) const = 0;
   };
// class Expression

/**
 * A number
 */
class Number: public Expression
   {
protected:

   int64_t value;

public:

   Number( int64_t val );

   int64_t Eval( ) const override;
   };
// class Number

/**
 * Addition expression
 */
class Add: public Expression
   {
protected:
   Expression *left;
   Expression *right;

public:
   Add(Expression *l, Expression *r);
   ~Add() override;
   int64_t Eval() const override;
   };
// class Add

/**
 * Multiplication expression
 */
class Multiply: public Expression
   {
protected:
   Expression *left;
   Expression *right;

public:
   Multiply(Expression *l, Expression *r);
   ~Multiply() override;
   int64_t Eval() const override;
   };
// class Multiply

#endif /* EXPRESSION_H_ */
